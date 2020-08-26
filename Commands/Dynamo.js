const AWS = require('aws-sdk');
const Command = require(`./Command.js`);

class Dynamo extends Command {
  constructor() {
    super();
    this.name = `dynamo`;
    this.aliases = [`dynamodb`, `db`];
    this.description = `Test connection to dynamodb!`;
    this.usage = ``;
  }

  execute(Message) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
    };
    
    docClient.scan(params, onScan);
    var count = 0;
    
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            data.Items.forEach(function(itemdata) {
               console.log("Item :", ++count,JSON.stringify(itemdata));
            });
    
            Message.reply(`There is ${count} records in the database`);
        }
    }
  }
}

module.exports = Dynamo;