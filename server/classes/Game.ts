import { Socket } from 'socket.io'
import Card from './Card'
import Deck from './Deck'
import Player from './Player'

export default class Game {
    // room: Record<string, unknown>
    deck: Deck
    stack: Record<string, Card>[]
    players: Record<string, Player>

    constructor () {
        this.deck = {} as Deck
        this.stack = []
        this.players = {} as Record<string, Player>
    }

    // createDeck () : void {
    //     this.deck = new Deck()
    // }

    addPlayer (socketID: string, player: Player) : void {
        this.players[socketID] = player
    }

    deletePlayer (socketID: string) : void {
        delete this.players[socketID]
    }

    getCardInventory () : Record<string, number> {
        // eslint-disable-next-line prefer-const
        let inventory: Record<string, number> = {}

        Object.keys(this.players).forEach(socketID => {
            inventory[socketID] = this.players[socketID].hand.length
        })

        return inventory
    }
}
