class card
  constructor: (@color, @type) ->
    if @color == 'red' or 'green' or 'yellow' or 'blue'
      this.id = @color + "_" + @type
    else
      this.id = @type

    if @color == 'red' or 'green' or 'yellow' or 'blue'
      this.name = @color + " " + @type
    else
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


# Create new deck
deck = []

createNewDeck = ->
  deck = []
  colors = ['red', 'green', 'yellow', 'blue']
  specialTypes = ['skip', 'reverse', '+2']

  for color in colors

    # Number Cards (with 0)
    count = 0;
    while count <= 9
      deck.push new card(color, count)
      count++

    # Number Cards (without 0)
    count = 1;
    while count <= 9
      deck.push new card(color, count)
      count++

    # Color special cards
    while count <= 9
      deck.push new card(color, count)
      count++

  shuffle(deck)
  return

createNewDeck();

card = new card 'red', '3'
console.log card.id
console.log deck

socket = io()

###
movement =
  up: false
  down: false
  left: false
  right: false

document.addEventListener 'keydown', (event) ->
  switch event.keyCode
    when 65
      # A
      movement.left = true
    when 87
      # W
      movement.up = true
    when 68
      # D
      movement.right = true
    when 83
      # S
      movement.down = true
  return
document.addEventListener 'keyup', (event) ->
  switch event.keyCode
    when 65
      # A
      movement.left = false
    when 87
      # W
      movement.up = false
    when 68
      # D
      movement.right = false
    when 83
      # S
      movement.down = false
  return

socket.emit 'new player'
setInterval (->
  socket.emit 'movement', movement
  return
), 1000 / 60

canvas = document.getElementById('canvas')
canvas.width = 800
canvas.height = 600
context = canvas.getContext('2d')
socket.on 'state', (players) ->
  context.clearRect 0, 0, 800, 600
  context.fillStyle = 'green'
  for id of players
    player = players[id]
    context.beginPath()
    context.arc player.x, player.y, 10, 0, 2 * Math.PI
    context.fill()
  return###


