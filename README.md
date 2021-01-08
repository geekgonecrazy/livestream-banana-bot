# Livestream-banana-bot
=================

## Chatbot Overview

This bot connects to: 
* twitch irc for our twitch chat.
* owncast for your owncast chat.  Might need to be using: https://github.com/owncast/owncast/pull/574 until merged.

Sends messages from both into a Rocket.Chat Channel.

It also serves a page at: /embed which when you send `!dance` in either twitch or owncast will cause a dancing banana to show up.  This will allow you to setup this page as a browser source in OBS.

Sends message to owncast as broadcaster when the banana dances

### Get Environment Variables

To start, you’ll need three environment variables:
 
| *Variable*  | *Description*   |
|---|---|---|---|---|
| `BOT_USERNAME`  |  The account (username) that the chatbot uses to send chat messages. This can be your Twitch account. Alternately, many developers choose to create a second Twitch account for their bot, so it's clear from whom the messages originate. |  
|`CHANNEL_NAME`   |  The Twitch channel name where you want to run the bot. Usually this is your main Twitch account. |
|`OAUTH_TOKEN`   |The token to authenticate your chatbot with Twitch's servers. Generate this with [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/) (a Twitch community-driven wrapper around the Twitch API), while logged in to your chatbot account. The token will be an alphanumeric string.|
|`WEBHOOK_SECRET` | This token is what you will need to use when hooking up owncast to point at the webhook |
|`ROCKETCHAT_HOOK` | This takes a Rocket.Chat integration endpoint |
|`OWNCAST_URL` | This is the URL to your owncast instance.  |
|`OWNCAST_TOKEN` | This is the Access Token you need to have generated in your owncast admin. |

### Running the bot

1. Build a .env file with the values for the environment variables above
2. Deploy this somewhere like glitch - Can be easily deployed remixing: https://glitch.com/edit/#!/cheerful-curse-hell
3. In owncast create a webhook pointing to your apps address by going to: http://your-owncast-server/admin/webhooks
4. In owncast create a access token so you can post messages to owncast chat.  Do this by going to: http://your-owncast-server/admin/access-tokens
4. Open https://your-app/embed and you'll be able to see dancing banana any time someone types `!dance`
5. Can view all of your messages in a Rocket.Chat channel across both platforms
6. Add embed path to your OBS setup to get a dancing banana on stream any time one of your follows types the secret phrase.
