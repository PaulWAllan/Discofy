const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const token = config.token;

client.on("ready", () => {
    console.log("Discofy: Ready to roll out!");
});

client.on("message", (message) => {
    if (message.content.startsWith(token + "play")) {
        message.channel.send("pong!");//TODO: do play stuff here
    } 
});

client.login(config.key);
