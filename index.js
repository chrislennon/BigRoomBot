const Bot = require('./Bot');

const BigRoomBot = new Bot();

// Handle graceful shutdowns
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function cleanup() {
  BigRoomBot.destroy();
  process.exit();
}

BigRoomBot.connect();
