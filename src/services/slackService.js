const { App } = require("@slack/bolt");

const app = new App({
    socketMode: true,
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
});

module.exports = { app: app };