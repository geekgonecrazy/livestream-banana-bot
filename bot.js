const express = require("express");
const ws = require('ws');

const tmi = require('tmi.js');
const axios = require('axios');

/*if (process.env.NODE_ENV == "development") {
    const dotenv = require('dotenv').config();
}*/

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

console.log('Connecting to twitch irc with user:', process.env.BOT_USERNAME);

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (channel, tags, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const message = msg.trim();

  handleMessage('twitch', tags.username, message);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

async function handleMessage(source, author, text) {
    if (text == "!dance") {
        console.log('Making the banana dance!');

        wsServer.clients.forEach(function each(client) {
            client.send(`{"type":"action", "action": "dance", "sender": "${author}(${source})"}`);
        });
      
        await sendToOwncast('Dance Banana Dance!');
        await sendToRocketChat('SYSTEM', 'me', 'Dance Banana Dance!');
    }

    await sendToRocketChat(source, author, text);
}

async function sendToRocketChat(source, author, text) {
    try {
        const rcMessage = {
            'alias': `${source} - ${author}`,
            'text': text
        };

        console.log(`Sending Message To Rocket.Chat from ${source} - ${author}: ${text}`);

        const result = axios.post(process.env.ROCKETCHAT_HOOK, rcMessage);

        console.log(`Status back: ${result.statusCode}`);
    } catch (e) {
        console.log('Error calling webhook', e);
    }
}

async function sendToOwncast(text) {
    try {
        const owncastMessage = {
            'body': text
        };

        console.log(`Sending Message To Owncast ${text}`);

        const headers = {
          Authorization: `Bearer ${process.env.OWNCAST_TOKEN}`
        }
      
        const result = axios.post(`${process.env.OWNCAST_URL}/api/admin/sendsystemmessage`, owncastMessage, { headers });

        console.log(`Status back: ${result.statusCode}`);
    } catch (e) {
        console.log('Error calling owncast', e);
    }
}

const app = express();

app.use(express.json());

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', message => {
      if (message == "PING") {
          socket.send('{type: "pong"}');
      } else {
          console.log(message);
      }
  });
});

app.use(express.static("public"));

app.get("/embed", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/owncast", (req, res) => {
    if (req.query.secret == process.env.WEBHOOK_SECRET) {
        const body = req.body;

        if (body.type && body.type == 'CHAT') {
            if (body.eventData && body.eventData.rawBody) {
                const message = body.eventData;

                handleMessage('owncast', message.author, message.rawBody);
            }
        }
    }

    res.json({status: 200});
});

const server = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + server.address().port);

    server.on('upgrade', (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, socket => {
            console.log('Websocket connection established');

            wsServer.emit('connection', socket, request);
        });
    });
});
