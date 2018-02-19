const Discord = require("discord.js");
const config = require("./config.json");
const commandList = require("./commandList.json");
const request = require("request-promise-native")
const NodeSpotify = require ("node-spotify-helper");
const Spotify = require('node-spotify-api');
const Pauseable = require('pauseable');
const api = require('genius-api');
const Lyricist = require('lyricist');

// Genius
var genius = new api(config.geniusClientAccessToken);
var lyricist = new Lyricist(config.geniusClientAccessToken);

// Spotify
const webApi = new NodeSpotify.SpotifyWebApi ();
const webHelper = new NodeSpotify.SpotifyWebHelper ();
var spotify = new Spotify({
  id: config.spotifyClientId,
  secret: config.spotifyClientSecret
});

// Discord
const client = new Discord.Client();

// Global Vars
var trackQueue = [];
var timeout = Pauseable.setTimeout( () => {}, 0)

async function init () {
  await webHelper.connect();
}


//
// Queue Management
//
async function play() {
  // Play first track in queue
  await webHelper.play(trackQueue[0].trackUrl);
  timeout = Pauseable.setTimeout(() => {

    // Remove first item
    trackQueue.shift();

    // Play next track
    if (trackQueue.length > 0) {
      play();
    } else
    // Pause after last item (Only used if auto play is enabled)
    if (trackQueue.length == 0) {
      setTimeout(() => {
        timeout.pause();
        pauseTrack();
      }, 0);
    }
    // Execute above code after duration of track
  }, trackQueue[0].trackDuration);
}

async function addTrackToQueue(queryT, message) {

  //Search spotify for track, save relevant data, add to track queue
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
    })
    .catch(function(err) {
      console.log(err);
    });

    //If only track, play
    if (trackQueue.length == 1) {
      play();
    }
}

async function removeTrackFromQueue(number, message){

  // Do not remove first item (currently playing)
  if(parseInt(number) !== 0){
    trackQueue.splice(parseInt(number), 1);
    // If only element, send now playing message
    if(trackQueue.length === 1){
      message.channel.send(nowPlaying());
    }
    // If there are many left, list track queue
    else if(trackQueue.length > 1){
      listQueue(message);
    }
    // Removed current track from queue, but is still playing.
    else{
      message.channel.send("Queue is empty");
    }
  }
}

async function pauseTrack() {
  // Pauses spotify
  await webHelper.pause();

  // Pauses duration counter
  timeout.pause();
}

async function unpauseTrack() {
  // Unpauses spotify
  await webHelper.unpause();

  // Unpauses duration counter
  timeout.resume();
}

async function skip() {

  // If only current song exists, remove from queue and pause
  if (trackQueue.length === 1)
  {
    pauseTrack();
    trackQueue.pop();
  }
  // Skip
  else {
    trackQueue.shift();
    play();
  }
}

function clearQueue(){
  // Clears everything but current track
  if (trackQueue.length > 1){
    trackQueue.splice(1,trackQueue.length)
  }
}


//
// Prints
//
function nowPlaying(){
  return "```Now Playing - " + trackQueue[0].trackName + " by " + trackQueue[0].trackArtist + "\n" + "on " + trackQueue[0].trackAlbum + "\n" + "requested by " + trackQueue[0].user + "```";
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


//
// Genius Methods
//

function chunkSubstr(str, size, message) {
  // Chunks lyrics into sendable sizes (2000 characters) and sends to channel

  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = "```" + str.substr(o, size) + "```";
    message.channel.send(chunks[i]);
  }
  return chunks
}

async function listLyrics(message) {
  // Finds song ID and gets lyrics
  var response = await genius.search(trackQueue[0].trackName + " " + trackQueue[0].trackArtist);
  var lyricResponse = await lyricist.song(parseInt(response.hits[0].result.id), {fetchLyrics: true});
  chunkSubstr(lyricResponse.lyrics, 1990, message);
}

async function showArtwork(message) {
  // Finds song ID and gets album image url
  var response = await genius.search(trackQueue[0].trackName + " " + trackQueue[0].trackArtist);
  var art = response.hits[0].result.header_image_url;
  message.channel.send(art);
}


//
// Event Handlers
//
client.on("ready", () => {
    init();
    console.log("Discofy: Ready to roll out!");
});

client.on("message", (message) => {
  // Parsing arguments
  if (message.content.startsWith(config.prefix)) {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

      if (command == "play") {
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
      } else
      if(command === "clear"){
        clearQueue();
      }
    }
});

//Bot token
client.login(config.token);
