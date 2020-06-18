class Game {
    constructor() {
        this.players = {};
        this.deck = [];
        this.stack = [];
    }

    addPlayer(socket, player) {
        this.players[socket] = player;
    }

    deletePlayer(socket) {
        delete this.players[socket]
    }

}
module.exports = Game