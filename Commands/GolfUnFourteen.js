const AWS = require('aws-sdk');
const Command = require(`./Command.js`);

class GolfUnFourteen extends Command {
  constructor() {
    super();
    this.name = `no14`;
    this.aliases = [`no14`, `nofourteen`, `nofail`];
    this.description = `Removes a 14 score on a user.`;
    this.usage = `no14 [@user]`;
  }

  execute(Message) {
    var dynamoDB = new AWS.DynamoDB.DocumentClient();

    const targetUser = Message.mentions.users.size > 0 ? Message.mentions.users.first() : Message.author;

    var params = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      Key: { "id": targetUser.id },
      ExpressionAttributeValues: { ":inc": -1 },
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

module.exports = GolfUnFourteen;