require('dotenv').config();
const fs = require(`fs`);
const EventEmitter = require('events');
const Discord = require('discord.js');
const ReactionHandler = require(`./ReactionHandler`);

class Bot extends EventEmitter {
  /**
   * Initializes all modules, a Discord client, binds events.
   * @constructor
   */
  constructor() {
    super();
    this.client = new Discord.Client();

    // Dynamically load commands from files
    this.commands = new Discord.Collection();
    // Setup roles reaction handler
    this.ReactionHandler = new ReactionHandler();

    fs.readdirSync(`./Commands`)
      .filter(file => file.endsWith(`.js`))
      .filter(file => file !== 'Command.js')
      .map(file => require(`./Commands/${file}`))
      .filter(cmd => cmd.name)
      .forEach(cmd => this.commands.set(cmd.name.toLowerCase(), new cmd()), this);

    this.bindEvents();
  }
  
  /**
   * Bind event functions.
   */
  bindEvents() {
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('message', this.onMessage.bind(this));
    this.client.on(`messageReactionAdd`, this.onMessageReactionAdd.bind(this));
    this.client.on(`messageReactionRemove`, this.onMessageReactionRemove.bind(this));
  }

  /**
   * Login client to Discord.
   */
  connect() {
    this.client.login(process.env.AUTH_TOKEN);
  }

  /**
   * Destroy Discord client.
   */
  destroy() {
    console.log('Shutting down.');
    this.client.destroy();
  }

  /**
   * Bot is connected to Discord.
   */
  onReady() {
    console.log(`Connected to Discord as ${this.client.user.username}#${this.client.user.discriminator} <@${this.client.user.id}>`);
    this.client.user.setStatus('available')

    // Dirty hack for caching an old message and making it available to reaction listeners
    // Longer term this method would likely be better and sustainable across test/dev servers
    // https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
    this.client.channels.cache.get('759031393053048843').messages.fetch('759034204360802365', true)

    var deployVersion;
    try {
      deployVersion = fs.readFileSync('.version');
    } catch (err) {
      // if no version file, assume 'local'
      deployVersion = 'local';
    }

    this.client.user.setPresence({
        activity: {
            name: `Commit: ${deployVersion}`,
            type: "PLAYING",
            url: "https://github.com/chrislennon/BigRoomBot"
        }
    });
  }

  /**
   * Handles messages.
   * @param {Message} Message Discord message object.
   */
  onMessage(Message) {
    // Ignore system, bot messages
    if (Message.system || Message.author.bot) {
      return;
    }

    // Ignore if message doesn't start with command character
    if (!Message.content.startsWith(`!`)) return;

    // Parse message, see if it matches command name or alias
    const args = Message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // If no command found, ignore
    if (!command) return;
    
    if (command.name == `help`) command.execute(Message, this, args);
    if (command.dmOnly && Message.channel.type != 'dm') Message.reply(`You can only use this command if you slide into my DMs 🤫`);
    // Execute command
    else command.execute(Message, args);
  }

  /**
   * Passes reaction add events to the ReactionHandler.
   * @param {Reaction} Reaction The Discord reaction object.
   * @param {User} User The Discord user that added the reaction.
   */
  onMessageReactionAdd(Reaction, User) {
    this.ReactionHandler.handleReaction(Reaction, User, `ADD`);
  }

  /**
   * Passes reaction remove events to the ReactionHandler.
   * @param {Reaction} Reaction The Discord reaction object.
   * @param {User} User The Discord user that removed the reaction.
   */
  onMessageReactionRemove(Reaction, User) {
    this.ReactionHandler.handleReaction(Reaction, User, `REMOVE`);
  }
}

module.exports = Bot;
