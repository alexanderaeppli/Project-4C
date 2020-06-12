// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

// Dependency variables
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', 5000);
app.use('/public', express.static(__dirname + '/public'));

// Routing
let userName, gameroom;
app.get('/', function (request, response) {
    userName = request.query.user_name;
    gameroom = request.query.gameroom;
    console.log(userName + ' ' + gameroom);
    // Check if username and gameroom are set; if not show form
    if (typeof userName !== 'undefined' && typeof gameroom !== 'undefined' && userName.length >= '1' && gameroom.length >= '1') {
        response.sendFile(path.join(__dirname, 'game.html'));
    } else {
        response.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Starts the server.
server.listen(5000, function () {
    console.log('Starting server on port 5000');
});

// Classes
const Game = require('./ressources/classes/Game');
const Player = require('./ressources/classes/Player');
const Card = require('./ressources/classes/Card');

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

// Global variables
let deck = [];
let stack = [];
let players = {};
let CardInventory = {};

// Create new deck
function createNewDeck() {
    let card, color, colors, count, len, i, len1, j, specials;
    CardInventory = {};
    deck = [];
    stack = [];
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
        deck.push(new Card('special', 'wildcard'));
        count++;
    }
    // +4 Cards
    count = 1;
    while (count <= 4) {
        deck.push(new Card('special', '+4'));
        count++;
    }
    shuffle(deck);
}

function createCardInventory(players) {
    for (let [key, value] of Object.entries(players)) {
        CardInventory[`${key}`] = { name: value.name, hand: value.hand.length}
    }
    io.emit('card inventory', CardInventory);
}

io.on('connection', function (socket) {
    //add connected clients to players
    socket.on('new player', function () {
        socket.join(gameroom);
        players[socket.id] = new Player(userName, []);
        console.log(players)
        console.log('new Player connected to socket ' + socket.id);
        createCardInventory(players)
    });

    //remove disconnected clients from players
    socket.on('disconnect', function () {
        delete players[socket.id];
        console.log('Player disconnected from socket ' + socket.id);
    });

    //Start new game
    socket.on('new game', function () {
        console.log('starting new game');
        createNewDeck();
        // Give Player hands
        for (let [key, value] of Object.entries(players)) {
            value.resetHand();
            value.giveCards(7);
            io.to(key).emit('player hand', value);
        }
        stack = deck.slice(0, 1);
        deck = deck.slice(1);
        io.emit('stack', stack);
        createCardInventory(players);
    });

    socket.on('play card', function (card) {
        players[socket.id].playCard(Number(card)); // Play card
        socket.emit('player hand', players[socket.id]) // send updated Playerhand
        createCardInventory(players); // create new inventory
    });

    socket.on('draw card', function (card) {
        players[socket.id].giveCards(1); // Play card
        socket.emit('player hand', players[socket.id]) // send updated Playerhand
        createCardInventory(players); // create new inventory
    });
});