const Discord = require("discord.js");
const config = require("./config.json");
const commandList = require("./commandList.json");
const request = require("request-promise-native")
const NodeSpotify = require ("node-spotify-helper");
const Spotify = require('node-spotify-api');
const Pauseable = require('pauseable');
const EventEmitter = require('events').EventEmitter;
const api = require('genius-api');
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
var timeout = Pauseable.setTimeout( () => {}, 0)

async function init () {
  await webHelper.connect();
}

function fetchMessage (message){
  var fetch = message.author.username;
}

function clearQueue(){
  if (trackQueue.length > 1){
    trackQueue.splice(1,trackQueue.length)
  }
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
      totalList = totalList + counter.toString() + ". " + currTrack.trackName + " - " + currTrack.trackArtist + ", on " + currTrack.trackAlbum + " (" + currTrack.user + ")" + '\n';
      counter++;
    }
  }
  totalList = totalList + "```";
  message.channel.send(totalList);
}

async function skip() {
  if (trackQueue.length === 1)
  {
    pauseTrack();
    trackQueue.pop();
  }
  else {
    trackQueue.shift();
    play();
  }
}

async function play() {
  await webHelper.play(trackQueue[0].trackUrl);
  timeout = Pauseable.setTimeout(() => {
    // timeout.pause();
    trackQueue.shift();
    //console.log("shifted");

    if (trackQueue.length > 0) {
      play();
    } else
    if (trackQueue.length == 0) {
      setTimeout(() => {
        timeout.pause();
        pauseTrack();
      }, 0);
    }
  }, trackQueue[0].trackDuration);
}

function nowPlaying(){
  return "```Now Playing - " + trackQueue[0].trackName + " by " + trackQueue[0].trackArtist + "\n" + "on " + trackQueue[0].trackAlbum + "\n" + "requested by " + trackQueue[0].user + "```";
}

async function removeTrackFromQueue(number, message){

  if(parseInt(number) !== 0){
    trackQueue.splice(parseInt(number), 1);
    if(trackQueue.length === 1){
      message.channel.send(nowPlaying());
    }
    else if(trackQueue.length > 1){
      listQueue(message);
    }
    else{
      message.channel.send("Queue is empty");
    }
  }
}

async function addTrackToQueue(queryT, message) {
  await spotify
    .search({ type: 'track', query: queryT })
    .then(function(response) {
      trackQueue.push({
        user : message.author.username,
        trackName : response.tracks.items[0].name,
        trackArtist: response.tracks.items[0].artists[0].name,
        trackAlbum: response.tracks.items[0].album.name,
        trackUrl : response.tracks.items[0].uri,
        trackDuration : response.tracks.items[0].duration_ms
      });
      //console.log(trackQueue[0]);
    })
    .catch(function(err) {
      console.log(err);
    });

    if (trackQueue.length == 1) {
      play();
    }
}
function chunkSubstr(str, size, message) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = "```" + str.substr(o, size) + "```";
    message.channel.send(chunks[i]);
  }
  return chunks
}
async function listLyrics(message) {
  var songLyrics = "";
  var response = await genius.search(trackQueue[0].trackName + " " + trackQueue[0].trackArtist);
  var o = await lyricist.song(parseInt(response.hits[0].result.id), {fetchLyrics: true});
  chunkSubstr(o.lyrics, 1990, message);
}

async function showArtwork(message) {
  var response = await genius.search(trackQueue[0].trackName + " " + trackQueue[0].trackArtist);
  var art = response.hits[0].result.header_image_url;
  message.channel.send(art);
}

async function pauseTrack() {
  await webHelper.pause();
  timeout.pause();
}

async function unpauseTrack() {
  await webHelper.unpause();
  timeout.resume();
}

client.on("ready", () => {
    init();
    console.log("Discofy: Ready to roll out!");
});

client.on("message", (message) => {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  fetchMessage(message);


    if (command == "play") {
      // Run a query
      const [...query] = args.splice(0);
      if (query.length > 0){
        addTrackToQueue(query.join(" "), message);
      }
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
      if(trackQueue.length === 1){
        message.channel.send(nowPlaying());
      }
      else if(trackQueue.length > 1){
        listQueue(message);
      }
    } else
    if(command === "playing"){
      message.channel.send(nowPlaying());
    } else
    if(command === "remove"){
      const [...query] = args.splice(0);
      removeTrackFromQueue(query.join(" "), message);
    } else
    if(command === "lyrics"){
      listLyrics(message);
    } else
    if(command === "art"){
      showArtwork(message);
    } else
    if(command === "skip"){
      skip();
    }
    if(command === "clear"){
      clearQueue();
    }
});

client.login(config.token);
