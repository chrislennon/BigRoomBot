const AWS = require('aws-sdk');
const Command = require(`./Command.js`);
const Discord = require('discord.js');

class Stats extends Command {
  constructor() {
    super();
    this.name = `stats`;
    this.aliases = [`stats`, `stat`, `golf`, `golfstats`];
    this.description = `Stats for games we are tracking such as golf with friends!`;
    this.usage = `stats [@user]`;
  }

  execute(Message) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
    };
    
    docClient.scan(params, onScan);
    var count = 0;

    const statsEmbed = new Discord.MessageEmbed()
      .setTitle('Golf Stats')
      .attachFiles(['../images/golf.png'])
      .setImage('attachment://golf.png')
      .setColor('#00ff00')
      .setDescription('Current Golf Stats')
      .setTimestamp()

    var statsArray = [];
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            data.Items.forEach(function(itemdata) {
               console.log("Item :", ++count,JSON.stringify(itemdata));
               statsArray.push(
                 {name: `<@${itemdata.id}>`, value: `Wins: ${itemdata.golfWins}, 14s: ${itemdata.golfFourteens}`}
               )
            });
            statsEmbed.addField(statsArray);
    
            Message.channel.send(statsEmbed);
        }
    }
  }
}

module.exports = Stats;