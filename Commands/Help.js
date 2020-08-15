const Command = require(`./Command.js`);

class Help extends Command {
  constructor() {
    super();
    this.name = `help`;
    this.aliases = [`commands`];
    this.description = `List all of my commands or info about a specific command.`;
    this.usage = `[command name]`;
  }

  execute(message, bot, args) {
    const data = [];
    const { commands } = bot;
    
    if (args && args.length) {
    
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** !${command.name} ${command.usage}`);

        message.channel.send(data, { split: true });
    } else {
        data.push('Here\'s a list of all my commands:');
        data.push(commands.map(command => command.name).join(', '));
        data.push(`\nYou can send \`!help [command name]\` to get info on a specific command!`);
        
        return message.author.send(data, { split: true })
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I\'ve sent you a DM with all my commands!');
            })
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
            });
    }
  }
}

module.exports = Help;