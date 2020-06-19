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
let playerName, gameroom, games = {}, CardInventory = {};

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

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
const createNewDeck = require('./ressources/scripts/server/deck');

function createCardInventory(players, gameroom) {
    CardInventory[gameroom] = {};
    for (let [key, value] of Object.entries(players)) {
        CardInventory[gameroom][`${key}`] = {name: value.name, hand: value.hand.length};
    }
}

io.on('connection', function (socket) {
    //add connected clients to players
    socket.on('new player', function () {
        socket.gameroom = gameroom;
        socket.join(gameroom);
        socket.gameroom = gameroom;
        // Create new Game if it not already exists
        if (!(games.hasOwnProperty(socket.gameroom))) {
            games[socket.gameroom] = new Game();
        }
        // add player to game
        let player = new Player(playerName);
        games[socket.gameroom].addPlayer(socket.id, player);
        console.log('new Player connected to socket ' + socket.id + ' and room ' + socket.gameroom);
        createCardInventory(games[socket.gameroom].players, socket.gameroom); // create new inventory
        io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // Send inventory

    });

    //remove disconnected clients from players
    socket.on('disconnect', function () {
        if (games[socket.gameroom]) {
            games[socket.gameroom].deletePlayer(socket.id);
            console.log('Player disconnected from socket ' + socket.id + ' and room ' + socket.gameroom);
            createCardInventory(games[socket.gameroom].players, socket.gameroom); // create new inventory
            io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // Send inventory
        }
    });

    //Start new games[socket.gameroom]
    socket.on('new game', function () {
        console.log('starting new game');
        createNewDeck(games[socket.gameroom]);
        // Give Player hands
        for (let [key, value] of Object.entries(games[socket.gameroom].players)) {
            value.resetHand();
            games[socket.gameroom].deck = value.giveCards(7, games[socket.gameroom].deck);
            io.to(key).emit('player hand', value);
        }
        games[socket.gameroom].stack = games[socket.gameroom].deck.slice(0, 1);
        games[socket.gameroom].deck = games[socket.gameroom].deck.slice(1);
        io.to(socket.gameroom).emit('stack', games[socket.gameroom].stack);

        createCardInventory(games[socket.gameroom].players, socket.gameroom); // create new inventory
        io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // Send inventory
    });

    socket.on('play card', function (card) {
        const players = games[socket.gameroom].players
        players[socket.id].playCard(Number(card), games[socket.gameroom].stack); // Play card
        socket.emit('player hand', players[socket.id]) // send updated PlayerHand
        io.to(socket.gameroom).emit('stack', games[socket.gameroom].stack); // send stack
        createCardInventory(games[socket.gameroom].players, socket.gameroom); // create new inventory
        io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // send inventory
        console.log(games)
    });

    socket.on('draw card', function () {
        const players = games[socket.gameroom].players
        games[socket.gameroom].deck = players[socket.id].giveCards(1, games[socket.gameroom].deck); // Receive card
        socket.emit('player hand', players[socket.id]) // send updated PlayerHand
        createCardInventory(players, socket.gameroom); // create new inventory
        io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]); // Send inventory
    });
});