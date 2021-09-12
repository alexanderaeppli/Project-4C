// Dependencies
import express from 'express'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'

// Classes
// import Game from './server/classes/Game'
import Player from './server/classes/Player'
// import Deck from './server/classes/Deck'

// Dependency variables
const app = express()
const server = new http.Server(app)
const io = new Server(server)

app.set('port', 5000)
app.use(express.static(path.join(__dirname, '/dist')))

// Global variables
// let playerName: string
const players: Record<string, unknown> = {}
// const CardInventory: Record<string, unknown> = {}

// Starts the server.
server.listen(5000, function () {
    console.log('Starting server on port 5000')
})

// function createCardInventory (players, gameroom) {
//     CardInventory[gameroom] = {}
//     for (const [key, value] of Object.entries(players)) {
//         CardInventory[gameroom][`${key}`] = { name: value.name, hand: value.hand.length }
//     }
// }

io.on('connection', function (socket) {
    socket.on('new player', function () {
        socket.join('1')
        players[socket.id] = new Player()
        console.log(players)
        console.log('new Player connected to socket ' + socket.id)
        // createCardInventory(players)
    })

    /** remove disconnected clients from players */
    // socket.on('disconnect', function () {
    //     if (players[socket.gameroom]) {
    //         players[socket.gameroom].deletePlayer(socket.id)
    //         console.log('Player disconnected from socket ' + socket.id + ' and room ' + socket.gameroom)
    //     }
    //     createCardInventory(players[socket.gameroom].room, socket.gameroom) // create new inventory
    //     io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]) // Send inventory
    // })

    // // Start new game
    // socket.on('new game', function () {
    //     console.log('starting new game')
    //     createNewDeck(players[socket.gameroom])
    //     // Give Player hands
    //     for (const [key, value] of Object.entries(players[socket.gameroom].room)) {
    //         value.resetHand()
    //         value.giveCards(7, players[socket.gameroom].deck)
    //         io.to(key).emit('player hand', value)
    //     }
    //     players[socket.gameroom].stack = players[socket.gameroom].deck.slice(0, 1)
    //     players[socket.gameroom].deck = players[socket.gameroom].deck.slice(1)
    //     io.to(socket.gameroom).emit('stack', players[socket.gameroom].stack)

    //     createCardInventory(players[socket.gameroom].room, socket.gameroom) // create new inventory
    //     io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]) // Send inventory
    // })

    // socket.on('play card', function (card) {
    //     players[socket.gameroom].room[socket.id].playCard(Number(card), players[socket.gameroom].stack) // Play card
    //     socket.emit('player hand', players[socket.gameroom].room[socket.id]) // send updated PlayerHand
    //     io.to(socket.gameroom).emit('stack', players[socket.gameroom].stack) // send stack

    //     createCardInventory(players[socket.gameroom].room, socket.gameroom) // create new inventory
    //     io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]) // send inventory
    // })

    // socket.on('draw card', function () {
    //     players[socket.gameroom].room[socket.id].giveCards(1, players[socket.gameroom].deck) // Receive card
    //     socket.emit('player hand', players[socket.gameroom].room[socket.id]) // send updated PlayerHand

    //     createCardInventory(players[socket.gameroom].room, socket.gameroom) // create new inventory
    //     io.to(socket.gameroom).emit('card inventory', CardInventory[socket.gameroom]) // Send inventory
    // })
})
