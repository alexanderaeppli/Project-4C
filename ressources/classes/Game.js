class Game {
    constructor() {
        this.room = {};
        this.deck = [];
        this.stack = [];
    }

    addPlayer(socket, player) {
        this.room[socket] = player;
    }

    deletePlayer(player) {
        delete this.room.player;
    }

}
module.exports = Game