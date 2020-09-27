const AWS = require('aws-sdk');
const Command = require(`./Command.js`);
const Discord = require('discord.js');

class GolfStart extends Command {
  constructor() {
    super();
    this.name = `golfstart`;
    this.aliases = [`golfstart`, `start`, `game`];
    this.description = `Starts a game embed where people can keep track of scores`;
    this.usage = `golfstart`;
    this.message = undefined
    this.reactions = [];
    this.user_icons = [];
  }

  async execute(Message) {

    const statsEmbed = new Discord.MessageEmbed()
      .setTitle(`Its Time for some gooooooolf!`)
      .setColor('#FF0000')
      .setDescription('SMASH IT')
      .setImage('https://media.s-bol.com/31RNryknoB0O/550x550.jpg')
      .setTimestamp()


    this.message = await Message.channel.send(statsEmbed);
    
    //TODO: gotta get a list of emoctions from the users from dynamo
    this.users_icons = 
    [
      { name: "Peter", icon: "🦊" },
      { name: "Matt", icon: "🐺" },
      { name: "David", icon: "🐱"}
    ];

    let usersMessage = '';
    this.users_icons.forEach((user) => {
      usersMessage += `${user.name} : ${user.icon} \n`;
      this.reactions.push(user.icon);
    });
    await Message.channel.send(usersMessage)

    for (const reaction of this.reactions) {
      await this.message.react(reaction);
    }

    await this.reactionHook();
  }

  async reactionHook () {
    const filter = (reaction, user) => {
      return this.reactions.includes(reaction.emoji.name);
    };

    await this.message.awaitReactions(filter,  { max: 1 }).then(
      collected => {
        const reaction = collected.first();
        const userId = reaction.users.cache.find((user) => user.bot !== true)
        this.users_icons.find((user) => (user.icon === reaction.emoji.name))
        reaction.users.remove(
          reaction.users.cache.find(
            (user) => user.bot !== true
        ));
        this.reactionHook()
        //TODO: store in DB based on the userId
      }
    )
    .catch(collected => {
      console.log(collected)
      this.reactionHook();
    });
  }
}

module.exports = GolfStart;