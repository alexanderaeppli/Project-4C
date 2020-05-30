// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
app.set('port', 5000);

app.use('/public', express.static(__dirname + '/public'));

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function () {
    console.log('Starting server on port 5000');
});

class Card {
    constructor(color, type) {
        this.color = color;
        this.type = type;
        if (this.color === 'red' || this.color === 'green' || this.color === 'yellow' || this.color === 'blue') {
            this.id = this.color + "_" + this.type;
            this.name = this.color + " " + this.type;
        } else {
            this.id = this.type;
            this.name = this.type;
        }
    }

}

class Player {
    constructor(hand) {
        this.hand = hand;
    }

    giveCards(quantity) {
        this.hand = deck.slice(0, quantity);
        deck = deck.slice(quantity);
    };
}

// Shuffle function
function shuffle(array) {
    let currentIndex, randomIndex, temporaryValue;
    currentIndex = array.length;
    temporaryValue = void 0;
    randomIndex = void 0;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Variables
let deck = [];

// Create new deck
function createNewDeck() {
    let card, color, colors, count, len, i, len1, j, specials;
    deck = [];
    colors = ['red', 'green', 'yellow', 'blue'];
    specials = ['reverse', 'reverse', 'skip', 'skip', '+2', '+2'];
    for (i = 0, len = colors.length; i < len; i++) {
        color = colors[i];
        // Number Cards (with 0)
        count = 0;
        while (count <= 9) {
            deck.push(new Card(color, count));
            count++;
        }
        // Number Cards (without 0)
        count = 1;
        while (count <= 9) {
            deck.push(new Card(color, count));
            count++;
        }
// Color special cards
        for (j = 0, len1 = specials.length; j < len1; j++) {
            card = specials[j];
            deck.push(new Card(color, card));
            count++;
        }
    }
    // Wildcardsdeck
    count = 1;
    while (count <= 4) {
        deck.push(new Card(false, 'wildcard'));
        count++;
    }
    // +4 Cards
    count = 1;
    while (count <= 4) {
        deck.push(new Card(false, '+4'));
        count++;
    }
    shuffle(deck);
}

let players = {};

io.on('connection', function (socket) {

    //add connected clients to players
    socket.on('new player', function () {
        players[socket.id] = new Player([]);
        console.log('new Playesr connected to socket ' + socket.id);
        console.log(players);
    });

    //remove disconnected clients from players
    socket.on('disconnect', function () {
        delete players[socket.id];
        return console.log('Player disconnected from socket ' + socket.id);
    });

    //Start new game
    socket.on('new game', function () {
        console.log('starting new game');
        createNewDeck();
        // Give Player hands
        let playerCardsMap = new Map;
        for (let [key, value] of Object.entries(players)) {
            value.giveCards(7);
            playerCardsMap.set(key, value.length)
            io.sockets(key).emit('state', value.hand);
        }
        socket.emit(players[socket.id].hand);
        io.emit('state', playerCardsMap);
    });
});

/*
var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
      players[socket.id] = {
          x: 300,
          y: 300
      };
  });
  socket.on('movement', function(data) {
      var player = players[socket.id] || {};
      if (data.left) {
          player.x -= 5;
      }
      if (data.up) {
          player.y -= 5;
      }
      if (data.right) {
          player.x += 5;
      }
      if (data.down) {
          player.y += 5;
      }
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
*/