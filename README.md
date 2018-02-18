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

The inspiration for this bot is to interface with Spotify so that a user can allow other Discord users to queue up music in a playlist without having to use a Spotify collaborative playlist. Users can then use Spotify to "Listen Along" to the host. Users can also ask for the lyrics directly through the bot and get current track information and album artwork.

This bot relies on a user having Spotify premium and be listening along in the Spotify app.

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

* Set up a Spotify developer account and create an app. Grab the Client ID and Client Secret and replace the placeholders in the config.json file.
* GENIUS INSTRUCTIONS


## Commands:
* **$artwork** : Displays currently playing song's album artwork.
* **$clear** : Clears entire playlist.
* **$forceskip** : Immediately skips current song.
* **$help** : Lists commands.
* **$list** : Alias for $queue command.
* **$lyrics** : Display lyrics for current song from Genius.com.
* **$pause** : Stop playback of current song.
* **$unpause** : Resume playback.
* **$play [args]** : Searches Spotify for search terms, and adds first result to queue.
* **$queue** : Displays queue of upcoming songs.

### Future Commands
* **$remove [index]** : Removes the #th song. If no # given, removes most recently queued song.
* **$shuffle** : Shuffles queue of songs.
* **$voteskip** : Initiates a vote to skip.




