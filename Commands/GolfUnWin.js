const AWS = require('aws-sdk');
const Command = require(`./Command.js`);

class GolfUnWin extends Command {
  constructor() {
    super();
    this.name = `nowin`;
    this.aliases = [`nowin`, `golfnowin`];
    this.description = `Removes a win from a user.`;
    this.usage = `nowin [@user]`;
  }

  execute(Message) {
    var dynamoDB = new AWS.DynamoDB.DocumentClient();

    const targetUser = Message.mentions.users.size > 0 ? Message.mentions.users.first() : Message.author;

    var params = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      Key: { "id": targetUser.id },
      ExpressionAttributeValues: { ":inc": -1 },
      ExpressionAttributeNames: {
        "#field": "golfWins"
      },
      UpdateExpression: "ADD #field :inc",
      ReturnValues: "UPDATED_NEW"
    };
    
    dynamoDB.update(params, function(err, data) {
      if (err) {
          console.log(err, err.stack);
      } else {
          console.log(data);
          Message.reply(`${targetUser.toString()} has ${data.Attributes.golfWins} wins!`);
      }
    });    
  }
}

module.exports = GolfUnWin;