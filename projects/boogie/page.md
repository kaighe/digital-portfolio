# Boogie
> *A Discord music playing bot*
> 
> [`Github`](https://github.com/kaighe/Boogie)

I originally created boogie to replace the now deactivated bot [Groovy](https://groovy.bot/), although didn't end up using it for long as I could not afford to keep it running. It uses the Youtube API to search for music, the YoutubeDownload API to download the mp3 files, and the Discord API to handle commands and play the music, all written using Node.js.

The bot joins your voice chat after a user uses the `-play [song name/url]` command in chat, after which you can use the following commands to control it:

- `-ping`: Check if the bot is working
- `-play [song name/url]`: Change the song being played
- `-stop`: Stop playing the current song
- `-pause`: Pause the current song
- `-unpause`: Unpause the current song
- `-leave`: Kick the bot from the voice chat