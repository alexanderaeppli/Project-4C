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
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Routing
app.get('/:gameId(*[A-Za-z0-9_])', function (request, response) {
    // playerName = request.query.user_name;
    gameroom = request.params.gameId;
    // console.log(playerName + ' ' + gameroom);
    // // Check if playername and gameroom are set; if not show form
    // if (typeof playerName !== 'undefined' && typeof gameroom !== 'undefined' && playerName.length >= '1' && gameroom.length >= '1') {
    response.sendFile(path.join(__dirname, 'game.html'));
    // } else {
    //     response.sendFile(path.join(__dirname, 'index.html'));
    // }
});

// Starts the server.
server.listen(5000, function () {
    console.log('Starting server on port 5000');
});

// Classes
const Game = require('./ressources/classes/Game');
const Player = require('./ressources/classes/Player');

// Functions
const createNewDeck = require('./ressources/scripts/deck');

function createCardInventory(players, gameroom) {
    for (let [key, value] of Object.entries(players)) {
        if (!(CardInventory[gameroom])) {
            CardInventory[gameroom] = {};
        }
        CardInventory[gameroom][`${key}`] = {name: value.name, hand: value.hand.length};
    }
    //console.log(CardInventory);
    //return CardInventory;
}

io.on('connection', function (socket) {
    //add connected clients to players
    socket.on('new player', function () {
        socket.join(gameroom);
        socket.gameroom = gameroom;
        // Create new Game if it not already exists
        if (!(players.hasOwnProperty(socket.gameroom))) {
            players[socket.gameroom] = new Game();
        }
        // add player to game
        let player = new Player(playerName);
        players[socket.gameroom].addPlayer(socket.id, player);
        console.log('new Player connected to socket ' + socket.id + ' and room ' + socket.gameroom);
        createCardInventory(players[socket.gameroom].room, socket.gameroom); // create new inventory
        io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // Send inventory
    });

    //remove disconnected clients from players
    socket.on('disconnect', function () {
        if (players[socket.gameroom]) {
            players[socket.gameroom].deletePlayer(socket.id);
            console.log('Player disconnected from socket ' + socket.id + ' and room ' + socket.gameroom);
            createCardInventory(players[socket.gameroom].room, socket.gameroom); // create new inventory
            io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // Send inventory
        }
    });

    //Start new game
    socket.on('new game', function () {
        console.log('starting new game');
        createNewDeck(players[socket.gameroom]);
        // Give Player hands
        for (let [key, value] of Object.entries(players[socket.gameroom].room)) {
            value.resetHand();
            value.giveCards(7, players[socket.gameroom].deck);
            io.to(key).emit('player hand', value);
        }
        players[socket.gameroom].stack = players[socket.gameroom].deck.slice(0, 1);
        players[socket.gameroom].deck = players[socket.gameroom].deck.slice(1);
        io.to(socket.gameroom).emit('stack', players[socket.gameroom].stack);
        createCardInventory(players[socket.gameroom].room, socket.gameroom); // create new inventory
        io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // Send inventory
    });

    socket.on('play card', function (card) {
        players[socket.gameroom].room[socket.id].playCard(Number(card), players[socket.gameroom].stack); // Play card
        createCardInventory(players[socket.gameroom].room, socket.gameroom); // create new inventory
        socket.emit('player hand', players[socket.gameroom].room[socket.id]) // send updated PlayerHand
        io.to(socket.gameroom).emit('stack', players[socket.gameroom].stack); // send stack
        io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // send inventory
    });

    socket.on('draw card', function () {
        players[socket.gameroom].room[socket.id].giveCards(1, players[socket.gameroom].deck); // Receive card
        createCardInventory(players[socket.gameroom].room, socket.gameroom); // create new inventory
        socket.emit('player hand', players[socket.gameroom].room[socket.id]) // send updated PlayerHand
        io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // Send inventory
    });
});