const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;
// Require the Spotify Web Helper
const NodeSpotify = require ("node-spotify-helper");
const webApi = new NodeSpotify.SpotifyWebApi ();
const webHelper = new NodeSpotify.SpotifyWebHelper ();
const uri = await webHelper.connect ();

async function webApiDemo () {
  // Connect to the Web Api using your clientId and clientSecret
  await webApi.authenticate ("05e2cb49f24d40239bf468115cac64aa", "60cfc9d6da2c4a7b832a0d56e20e1498");

  // Run a query
  const tracks = await webApi.searchTracks ("Jackson 5");
  webHelperDemo(tracks[0].uri);
}

}

client.on("ready", () => {
    await webApi.authenticate ("05e2cb49f24d40239bf468115cac64aa", "60cfc9d6da2c4a7b832a0d56e20e1498");
    console.log("Discofy: Ready to roll out!");
});

client.on("message", (message) => {
    if (message.content.startsWith(prefix + "play")) {
        message.channel.send("pong!");//TODO: do play stuff here
    }
});

client.login(config.token);
