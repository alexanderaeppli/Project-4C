import Card from './Card'

export default class Deck {
    cardsNew: Card[]
    cardsPlayed: Card[]

    createNewDeck () : void {
        let card, color, count, len, i, len1, j
        const colors = ['red', 'green', 'yellow', 'blue']
        const specials = ['reverse', 'reverse', 'skip', 'skip', '+2', '+2']
        for (i = 0, len = colors.length; i < len; i++) {
            color = colors[i]
            // Number Cards (with 0)
            count = 0
            while (count <= 9) {
                this.cardsNew.push(new Card(color, count))
                count++
            }
            // Number Cards (without 0)
            count = 1
            while (count <= 9) {
                this.cardsNew.push(new Card(color, count))
                count++
            }
            // Color special cards
            for (j = 0, len1 = specials.length; j < len1; j++) {
                card = specials[j]
                this.cardsNew.push(new Card(color, card))
                count++
            }
        }
        // Wildcards
        count = 1
        while (count <= 4) {
            this.cardsNew.push(new Card('special', 'wildcard'))
            count++
        }
        // +4 Cards
        count = 1
        while (count <= 4) {
            this.cardsNew.push(new Card('special', '+4'))
            count++
        }

        this.cardsNew = this.shuffle(this.cardsNew)
    }

    /** Shuffle function */
    shuffle (array: Card[]) : Card[] {
        let currentIndex, randomIndex, temporaryValue
        currentIndex = array.length
        temporaryValue = 0
        randomIndex = 0
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1
            // And swap it with the current element.
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }
        return array
    }
}
