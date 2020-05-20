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

# Add the WebSocket handlers
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