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

// Global variables
let playerName, gameroom, players = {}, CardInventory = {};

// Routing
app.get('/', function (request, response) {
    playerName = request.query.user_name;
    gameroom = request.query.gameroom;
    console.log(playerName + ' ' + gameroom);
    // Check if playername and gameroom are set; if not show form
    if (typeof playerName !== 'undefined' && typeof gameroom !== 'undefined' && playerName.length >= '1' && gameroom.length >= '1') {
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

// Create new deck
function createNewDeck(game) {
    let card, color, colors, count, len, i, len1, j, specials;
    CardInventory = {};
    game.deck = [];
    game.stack = [];
    colors = ['red', 'green', 'yellow', 'blue'];
    specials = ['reverse', 'reverse', 'skip', 'skip', '+2', '+2'];
    for (i = 0, len = colors.length; i < len; i++) {
        color = colors[i];
        // Number Cards (with 0)
        count = 0;
        while (count <= 9) {
            game.deck.push(new Card(color, count));
            count++;
        }
        // Number Cards (without 0)
        count = 1;
        while (count <= 9) {
            game.deck.push(new Card(color, count));
            count++;
        }
        // Color special cards
        for (j = 0, len1 = specials.length; j < len1; j++) {
            card = specials[j];
            game.deck.push(new Card(color, card));
            count++;
        }
    }
    // Wildcards
    count = 1;
    while (count <= 4) {
        game.deck.push(new Card('special', 'wildcard'));
        count++;
    }
    // +4 Cards
    count = 1;
    while (count <= 4) {
        game.deck.push(new Card('special', '+4'));
        count++;
    }
    shuffle(game.deck);
}

function createCardInventory(players, room) {
    for (let [key, value] of Object.entries(players)) {
        CardInventory[`${key}`] = {name: value.name, hand: value.hand.length}
    }
    io.to(room).emit('card inventory', CardInventory);
}

io.on('connection', function (socket) {
    //add connected clients to players
    socket.on('new player', function () {
        socket.join(gameroom);
        // Create new Game if it not already exists
        if (!(players.hasOwnProperty(gameroom))) {
            players[gameroom] = new Game();
        }
        // add player to game
        let player = new Player(playerName);
        players[gameroom].addPlayer(socket.id, player);
        console.log(players)
        console.log('new Player connected to socket ' + socket.id);
        createCardInventory(players[gameroom].room, gameroom);
    });

    //remove disconnected clients from players
    socket.on('disconnect', function () {
        //players[gameroom].deletePlayer(socket.id);
        console.log('Player disconnected from socket ' + socket.id);
    });

    //Start new game
    socket.on('new game', function () {
        console.log('starting new game');
        createNewDeck(players[gameroom]);
        // Give Player hands
        for (let [key, value] of Object.entries(players[gameroom].room)) {
            value.resetHand();
            value.giveCards(7, players[gameroom].deck);
            io.to(key).emit('player hand', value);
        }
        players[gameroom].stack = players[gameroom].deck.slice(0, 1);
        players[gameroom].deck = players[gameroom].deck.slice(1);
        io.emit('stack', players[gameroom].stack);
        createCardInventory(players[gameroom].room, gameroom); // create new inventory
    });

    socket.on('play card', function (card) {
        players[gameroom].room[socket.id].playCard(Number(card), players[gameroom].stack); // Play card
        io.emit('stack', players[gameroom].stack);
        socket.emit('player hand', players[gameroom].room[socket.id]) // send updated PlayerHand
        createCardInventory(players[gameroom].room, gameroom); // create new inventory
    });

    socket.on('draw card', function () {
        players[gameroom].room[socket.id].giveCards(1, players[gameroom].deck); // Receive card
        socket.emit('player hand', players[gameroom].room[socket.id]) // send updated PlayerHand
        createCardInventory(players[gameroom].room, gameroom); // create new inventory
    });
});