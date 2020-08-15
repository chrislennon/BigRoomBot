# BigRoomBot
BigRoomBot for the BigRoom Discord server.

## Requirements

- [Node.js](https://nodejs.org/)

## Running the bot
In order to connect to Discord your bot will need an auth token. You can create one from the [Discord Developer Portal](https://discordapp.com/developers/applications/). Once you've [created an application](https://discordpy.readthedocs.io/en/latest/discord.html), head to the "Bot" tab and click "Copy" to copy your token.

You'll need to assign this token as an environment variable called `AUTH_TOKEN` in order for your bot to connect to Discord. You can do this via a file called `.env`. See the `.env.example` file for an example of what this should look like

## Deployment
This repository comes with an included GitHub Actions workflow to deploy this bot to AWS (Elastic Beanstalk 😇).

To use this workflow you'll need to set the following secrets within GitHub:

    - AWS_ACCESS_KEY
    - AWS_SECRET_KEY
    - AWS_REGION
    - BEANSTALK_APP_NAME
    - BEANSTALK_ENV_NAME
    - DISCORD_AUTH_TOKEN
