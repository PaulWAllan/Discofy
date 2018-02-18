var api = require('genius-api');
const Lyricist = require('lyricist');
const request = require ("request-promise-native");
const Spotify = require("node-spotify-helper");
var genius = new api("56nfJ_85b3cqnYKDp5x45sN2orHw4aL-yhZSFPcX58UH7TERSp9UdpOFkeB-nTCg");
var songID = 0; 
var lyricist = new Lyricist("kUA-Mz9F6pCtu8LKNLC2RyLOFpbEiDFzJiMBxuSvuoFsttjbHkjHcohqx6MI8UWF");

//get annotation 
//genius.annotation(6737668).then(function(response) {
//  console.log(response.annotation);
//});

//get referents by song_id, with options 
//genius.referents({song_id: 378195}, {per_page: 2}).then(function(response) {
//  console.log('referents', response.referents);
//});
 
//search song
genius.search('HUMBLE. Kendrick Lamar').then(function(response) {
    var s = response.hits[0].result.id;
    songID = s;
    return s;
}).then(function(s){
lyricist.song(parseInt(s), {fetchLyrics: true}).then(song => console.log(song.lyrics))
});

//get artwork
genius.search('HUMBLE. Kendrick Lamar').then(function(response) {
    var s = response.hits[0].result.header_image_url;
    console.log(s);
});

//error handling á la promise 
//genius.song(378195).then(function(response) {
//  console.log('song', response.song);
//}).catch(function(error) {
//  console.error(error);
//});

//const result = await lyricist.song(714198, { fetchLyrics: true });
//console.log(song);
