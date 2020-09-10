const Command = require(`./Command.js`);

class Meme extends Command {
  constructor() {
    super();
    this.name = `meme`;
    this.aliases = [`meme`, `anon`];
    this.description = `I post memes from DMs anonymously on your behalf!`;
    this.usage = ``;
    this.dmOnly = true;
  }

  execute(Message) {
    let guildId = '615915874024554516';
    let guild = Message.client.guilds.cache.get(guildId);
    let channelId = '753578608500408480';
    let channel = guild.channels.cache.get(channelId);

    if (Message.attachments.size > 0) {
      // Looping wont work as planned as on submitting multiple images the command is only attached to first message
      Message.attachments.forEach(attachment => {
        channel.send({
          files: [attachment.url] 
        });
      });
    } else if (Message.content.split(' ')[1].startsWith('http')){
      channel.send(Message.content.split(' ')[1]);
    } else {
      Message.reply("I don't see an attachment or a link in your message");
    }
  }
}

module.exports = Meme;