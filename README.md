```
########################################################
.#####...######...####....####....####...######..##..##.
.##..##....##....##......##..##..##..##..##.......####..
.##..##....##.....####...##......##..##..####......##...
.##..##....##........##..##..##..##..##..##........##...
.#####...######...####....####....####...##........##...
########################################################
```

# Discofy
A Discord bot created for the CSSS Mountain Madness Hackathon 2018

## Team Sandbagging:
* Paul Allan
* Aman Deol
* Jason Wang
* Kenney Wu
* Jordan Yuen

## Purpose:

As of Febuary 18th 2018, users wishing to queue up and listen music collectively would have to use a Spotify collaborative playlist. The Discofy bot has been created to provide that functionality through Discord itself to “Listen Along” with a host. The bot is also able to provide current track information, album artwork, and lyrics of the song being listened to.  All users wishing to “Listen Along” must have a Spotify premium account. 

## Install

1. Clone or zip this repository to anywhere on your computer.
2. Run `npm update -S` on the root directory of Discofy.
3. Configure the bot (Instructions below).
4. Run `node run.js` on the root directory of Discofy.

### Requirements

* Spotify premium account.
* Spotify app installed on the computer running the bot.
* Node.js and npm  must be installed.

### Configuration

1) Setup a new Discord Application
2) Open up the config.json file and add the bot token to replace the placeholder
3) The bot can only be invited to a particular Discord server if the current user is an administrator.
Replace CLIENT_ID_HERE with the new Discord Application's client ID and follow the link:
https://discordapp.com/oauth2/authorize?&client_id=CLIENT_ID_HERE&scope=bot&permissions=0.

4) Using a Spotify developer account, create a new Spotify Application
5) In the config.json file, take the Client ID and the Client Secret of the Spotify application and replace the placeholders respectively. 

6) Create a Genius account
7) In the config.json file, use the Client Access Token from your Genius API Clients page and replace the placeholder of the respective field.

## Commands:
* **$art** : Displays currently playing song's album artwork.
* **$clear** : Clears entire playlist.
* **$skip** : Immediately skips current song.
* **$help** : Lists commands.
* **$list** : Display a list of queued songs.
* **$lyrics** : Display lyrics for current song from Genius.com.
* **$pause** : Stop playback of current song.
* **$unpause** : Resume playback.
* **$play [args]** : Searches Spotify for search terms, and adds first result to queue.
* **$remove [index]** : Removes a song based on its position in the queue. If no index is given, removes most recently queued song.

## Known Issues
* Does not handle empty Spotify API responses causing various issues.

## Future Development
* Permissions
* Deleting command messages
* Displaying 'Now Playing' message whenever a new song is playing.

### Commands
* **$shuffle** : Shuffles queue of songs.
* **$voteskip** : Initiates a vote to skip.
* **$playalbum** : Queues up an entire album.
