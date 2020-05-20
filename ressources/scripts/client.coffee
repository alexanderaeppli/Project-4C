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


#display player hand
displayPlayerHand = ->
  deckWrapper= document.getElementById('player__inventory')
  deckWrapper.innerHTML = ''
  for card in playerHand
    singleCard = document.createElement("div")
    singleCard.id = card.id
    singleCard.innerText = card.id
    deckWrapper.appendChild(singleCard)
  return

document.getElementById('reset_btn').onclick = ->
  createGame()
  console.log deck
  console.log playerHand
  displayPlayerHand()

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


