# Dependencies
express = require('express')
http = require('http')
path = require('path')
socketIO = require('socket.io')

app = express()
server = http.Server(app)
io = socketIO(server)
app.set 'port', 5000
app.use '/public', express.static(__dirname + '/public')

# Routing
app.get '/', (request, response) ->
  response.sendFile path.join(__dirname, 'index.html')
  return

# Starts the server.
server.listen 5000, ->
  console.log 'Starting server on port 5000'
  return


class Card
  constructor: (@color, @type) ->
    if @color == 'red' or @color == 'green' or @color == 'yellow' or @color == 'blue'
      this.id = @color + "_" + @type
      this.name = @color + " " + @type
    else
      this.id = @type
      this.name = @type

class Player
  constructor: ->
    hand: []

  giveCards = (targetID, quantity, source) ->
    players[targetID].this.hand = source.slice 0, quantity
    source = source.slice quantity
    return

# Shuffle function
shuffle = (array) ->
  currentIndex = array.length
  temporaryValue = undefined
  randomIndex = undefined
  # While there remain elements to shuffle...
  while 0 != currentIndex
    # Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    # And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  array

# Variables
deck = []
# Create new deck
createNewDeck = ->
  deck = []
  colors = ['red', 'green', 'yellow', 'blue']
  specials = ['reverse', 'reverse', 'skip', 'skip', '+2', '+2']

  for color in colors
# Number Cards (with 0)
    count = 0;
    while count <= 9
      deck.push new Card(color, count)
      count++

    # Number Cards (without 0)
    count = 1;
    while count <= 9
      deck.push new Card(color, count)
      count++

    # Color special cards
    for card in specials
      deck.push new Card(color, card)
      count++

  # Wildcardsdeck
  count = 1;
  while count <= 4
    deck.push new Card(false, 'wildcard')
    count++

  # +4 Cards
  count = 1;
  while count <= 4
    deck.push new Card(false, '+4')
    count++

  shuffle(deck)
  return

#giveCards = (target, source, quantity) ->
#  target = deck.slice 0, quantity
#  source = source.slice quantity
#  return

players = {}

io.on 'connection', (socket) ->
  #add connected clients to players
  socket.on 'new player', ->
    players[socket.id] = new Player
    console.log 'new player connected to socket ' + socket.id
    console.log players

  #remove disconnected clients from players
  socket.on 'disconnect', ->
    delete players[socket.id]
    console.log 'player disconnected from socket ' + socket.id

  socket.on 'new game', ->
    console.log 'starting new game'
    createNewDeck
    console.log deck
    io.sockets.emit 'state', deck
    return
#    players[socket.id].giveCards(7, deck)
#    console.log players
#    for player in players
#    io.sockets.emit 'state', players[socket.id].hand



###
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
###