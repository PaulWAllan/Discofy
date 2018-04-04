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

* Set up a new Discord App, and add the bot token to the placeholder in the config.json file. Invite the bot using this link: `https://discordapp.com/oauth2/authorize?&client_id=CLIENT_ID_HERE&scope=bot&permissions=0`. Replacing `CLIENT_ID_HERE` with your Discord App's client ID.
* Set up a Spotify developer account and create an app. Grab the Client ID and Client Secret and replace the placeholders in the config.json file.
* Set up Genuis account. Get your Client Access Token from the Genius API Clients page and enter it in the appropriate field in the config.json file.

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
