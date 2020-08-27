const AWS = require('aws-sdk');
const Command = require(`./Command.js`);

class GolfFourteen extends Command {
  constructor() {
    super();
    this.name = `14`;
    this.aliases = [`14`, `fourteen`, `fail`];
    this.description = `Increments number of 14 scores on a user.`;
    this.usage = `14 [@user]`;
  }

  execute(Message) {
    var dynamoDB = new AWS.DynamoDB.DocumentClient();

    const targetUser = Message.mentions.users.size > 0 ? Message.mentions.users.first() : Message.author;

    var params = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      Key: { "id": targetUser.id },
      ExpressionAttributeValues: { ":inc": 1 },
      ExpressionAttributeNames: {
        "#field": "golfFourteens"
      },
      UpdateExpression: "ADD #field :inc",
      ReturnValues: "UPDATED_NEW"
    };
    
    var response = dynamoDB.update(params, function(err, data) {
      if (err) {
          console.log(err, err.stack);
      } else {
          console.log(data);
      }
    });

    Message.reply(`${targetUser.toString()} has ${response.golfFourteens} lucky 14s!`);
  }
}

module.exports = GolfFourteen;