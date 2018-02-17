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
    } else if (message.content.startsWith(prefix + "help")) {
        var commands = '**Command List**' + '\n\n';
        for(var i in commandList){
            if(commandList.hasOwnProperty(i)){
                var tempstring = JSON.stringify(commandList[i]);
                tempstring = tempstring.slice(1, (tempstring.length-1));
                commands += tempstring + '\n';
            }
        }
        message.channel.send(commands);
    }
});

client.login(config.token);
