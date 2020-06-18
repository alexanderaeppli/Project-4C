class Game {
    constructor() {
        this.room = {};
        this.deck = [];
        this.stack = [];
    }

    addPlayer(socket, player) {
        this.room[socket] = player;
    }

    deletePlayer(socket) {
        delete this.room[socket]
    }

}
module.exports = Game