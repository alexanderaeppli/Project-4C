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

