const Discord = require("discord.js");
const config = require("./config.json");
const commandList = require("./commandList.json");
const request = require("request-promise-native")
const NodeSpotify = require ("node-spotify-helper");
const Spotify = require('node-spotify-api');
const Pauseable = require('pauseable');

const client = new Discord.Client();
const webApi = new NodeSpotify.SpotifyWebApi ();
const webHelper = new NodeSpotify.SpotifyWebHelper ();

var spotify = new Spotify({
  id: config.spotifyClientId,
  secret: config.spotifyClientSecret
});
var trackQueue = [];


async function init () {
  await webHelper.connect();
}


async function play() {
  await webHelper.play(trackQueue[0].trackUrl);
  //TODO: set timer for length of song - pause execution for length of song
  var timeout = Pauseable.setTimeout(() => {
    timeout.pause();
    trackQueue.shift();
    // console.log(trackQueue[0].trackName);
    if (trackQueue.length > 0) {
      play();
    } else
    if (trackQueue.length == 0) {
      setTimeout(() => {
        timeout.pause();
        pauseTrack();
      }, 1000);
    }
  }, trackQueue[0].trackDuration - 1000);
}

async function addTrackToQueue(queryT) {

  await spotify
    .search({ type: 'track', query: queryT })
    .then(function(response) {
      trackQueue.push({
        trackName : response.tracks.items[0].name,
        trackArtist: response.tracks.items[0].artists[0].name,
        trackAlbum: response.tracks.items[0].album.name,
        trackUrl : response.tracks.items[0].uri,
        trackDuration : response.tracks.items[0].duration_ms
      });
      console.log(trackQueue[0]);
    })
    .catch(function(err) {
      console.log(err);
    });

    if (trackQueue.length == 1) {
      play();
    }
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
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

    if (command == "play") {
      // Run a query
      const [...query] = args.splice(0);
      addTrackToQueue(query.join(" "));
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
