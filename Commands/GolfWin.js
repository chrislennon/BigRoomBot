const AWS = require('aws-sdk');
const Command = require(`./Command.js`);

class GolfWin extends Command {
  constructor() {
    super();
    this.name = `win`;
    this.aliases = [`golfwin`, `winner`];
    this.description = `Increments number of wins on a user.`;
    this.usage = `win [@user]`;
  }

  execute(Message) {
    var dynamoDB = new AWS.DynamoDB.DocumentClient();

    const targetUser = Message.mentions.users.size > 0 ? Message.mentions.users.first() : Message.author;

    var params = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      Key: { "id": { S: targetUser.id } },
      ExpressionAttributeValues: { ":inc": {N: "1"} },
      UpdateExpression: "ADD golfWin :inc",
      ReturnValues: "UPDATED_NEW"
    };
    
    var numberWins = dynamoDB.updateItem(params, function(err, data) {
      if (err) {
          console.log(err, err.stack);
      } else {
          console.log(data);
      }
    });

    Message.reply(`${targetUser.toString()} has ${numberWins} wins!`);
  }
}

module.exports = GolfWin;