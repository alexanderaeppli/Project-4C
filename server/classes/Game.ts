import Deck from './Deck'

export default class Game {
    room: Record<string, unknown>
    deck: Deck
    stack: Record<string, unknown>[]

    constructor () {
        this.room = {}
        this.stack = []
    }

    createDeck () : void {
        this.deck = new Deck()
    }

    addPlayer (socket, player) : void {
        this.room[socket] = player
    }

    deletePlayer (socket) : void {
        delete this.room[socket]
    }
}
