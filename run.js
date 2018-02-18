const Discord = require("discord.js");
const config = require("./config.json");
const commandList = require("./commandList.json");
const request = require("request-promise-native")
const NodeSpotify = require ("node-spotify-helper");
const Spotify = require('node-spotify-api');
const Pauseable = require('pauseable');
var api = require('genius-api');
const Lyricist = require('lyricist');
var genius = new api("56nfJ_85b3cqnYKDp5x45sN2orHw4aL-yhZSFPcX58UH7TERSp9UdpOFkeB-nTCg");
var songID = "";
var lyricist = new Lyricist("kUA-Mz9F6pCtu8LKNLC2RyLOFpbEiDFzJiMBxuSvuoFsttjbHkjHcohqx6MI8UWF");

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

function listQueue (message) {
  var totalList = "";
  var counter = 0;
  for (var track in trackQueue ) {
    if(counter === 0){
      totalList = totalList + nowPlaying() + '\n';
      counter++;
      totalList = totalList + "```";
    }
    else{
      var currTrack = trackQueue[track];
      totalList = totalList + counter.toString() + ". " + currTrack.trackName + " - " + currTrack.trackArtist + '\n';
      counter++;
    }
  }
  totalList = totalList + "```";
  message.channel.send(totalList);
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

function nowPlaying(){
  return "```Now Playing - " + trackQueue[0].trackName + " by " + trackQueue[0].trackArtist + "```";
}

async function removeTrackFromQueue(number, message){
  if(parseInt(number) !== 0){
    trackQueue.splice(parseInt(number), 1);
    listQueue(message);
  }
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

function listLyrics() {
  var songLyrics = "";
  genius.search(trackQueue[0].trackName + " " + trackQueue[0].trackArtist).then(function(response) {
    var s = response.hits[0].result.id;
    songID = s;
    return s;
    }).then(function(s){
      song = lyricist.song(parseInt(s), {fetchLyrics: true})
      return songLyrics = song;
    })
    console.log(songLyrics);
    return songLyrics;
}

function showArtwork() {
  genius.search('HUMBLE. Kendrick Lamar').then(function(response) {
    var s = response.hits[0].result.header_image_url;
    return s;
  })
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
    } else
    if (command === "list"){
      listQueue(message);
    } else
    if(command === "playing"){
      message.channel.send(nowPlaying());
    } else
    if(command === "remove"){
      const [...query] = args.splice(0);
      removeTrackFromQueue(query.join(" "), message);
    } else
    if(command === "lyrics"){
      var s = listLyrics();
      console.log(s);
      message.channel.send(s);
    } else
    if(command === "art"){
      message.channel.send(showArtwork());
    }
});

client.login(config.token);
