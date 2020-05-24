# Dependencies
express = require('express')
http = require('http')
path = require('path')
socketIO = require('socket.io')

app = express()
server = http.Server(app)
io = socketIO(server)
app.set 'port', 5000
app.use '/public', express.static(__dirname + '/static')

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
playerHand = []

# Create Game
createGame = ->
# Variables
  deck = []
  playerHand = []

  # Create new deck
  createNewDeck = ->
    deck = []
    colors = ['red', 'green', 'yellow', 'blue']
    specials = ['reverse', "reverse", 'skip', "skip", '+2', "+2"]

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
      for cards in specials
        deck.push new Card(color, cards)
        count++

    # Wildcards
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

  createPlayerHand = ->
    playerHand = deck.slice(0, 7)
    deck = deck.slice(7)
    return

  createNewDeck()
  createPlayerHand()


# Add the WebSocket handlerss
io.on 'connection', (socket) ->

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