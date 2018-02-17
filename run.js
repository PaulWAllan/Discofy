const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;
const commandList = require("./commandList.json");

client.on("ready", () => {
    console.log("Discofy: Ready to roll out!");
});

client.on("message", (message) => {
    if (message.content.startsWith(prefix + "play")) {
        message.channel.send("Make me do stuff!");//TODO: do play stuff here
    } else if (message.content.startsWith(prefix + "ping")) {
        message.channel.send("pong!");
    } //else if (message.content.startsWith(prefix + "help")) {
        
});

client.login(config.token);
