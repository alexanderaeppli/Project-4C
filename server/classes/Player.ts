import Card from './Card'

export default class Player {
    name: string
    hand: Record<string, unknown>[]

    constructor (name = 'Player') {
        this.name = name
        this.hand = []
    }

    giveCards (quantity: number, deck: Record<string, unknown>[]) : Record<string, unknown>[] {
        this.hand = this.hand.concat(deck.slice(0, quantity))
        deck = deck.slice(quantity)
        // this.hand.sort((a, b): number => {
        //     return a.id.localeCompare(b)
        // })
        return deck
    }

    playCard (card: Card, stack: Record<string, unknown>[]) : Record<string, unknown>[] {
        const playedCard = this.hand.find(obj => obj.uniqueid === card)
        const playedCardIndex = this.hand.findIndex(obj => obj.uniqueid === card)
        if (playedCard !== undefined) {
            // Bugfix: When the first card is played an undefined object is created (somehow) and added to the stack, breaking the game. Hence the condition.
            this.hand.splice(playedCardIndex, 1)
            stack.push(playedCard)
        }
        return stack
    }

    resetHand () : void {
        this.hand = []
    }
}
