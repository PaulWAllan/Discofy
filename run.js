const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;
const commandList = require("./commandList.json");

// Require the Spotify Web Helper
const NodeSpotify = require ("node-spotify-helper");
const webApi = new NodeSpotify.SpotifyWebApi ();
const webHelper = new NodeSpotify.SpotifyWebHelper ();
var tracks = "";

async function init () {
  // Connect to the Web Api using your clientId and clientSecret
  await webApi.authenticate ("05e2cb49f24d40239bf468115cac64aa", "60cfc9d6da2c4a7b832a0d56e20e1498");
  await webHelper.connect ();
}

async function playTrackFromQuery(query) {
  tracks = await webApi.searchTracks (query);
  await webHelper.play(tracks[0].uri);
}

async function pauseTrack() {
  await webHelper.pause();
}

async function unpauseTrack() {
  await webHelper.unpause();
}

client.on("ready", () => {
    init();
    console.log("Discofy: Ready to roll out!");
});

client.on("message", (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

    if (command == "play") {
      // Run a query
      const [...query] = args.splice(0);
      playTrackFromQuery(query.join(" "));
    } else
    if (command == "pause") {
      pauseTrack();
    } else
    if (command == "unpause") {
      unpauseTrack();
    } else 
    if (command == "help") {
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
