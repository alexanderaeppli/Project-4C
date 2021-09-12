let cardCounter = 0 // Used to create incremental unique ids for all cards
export default class Card {
    color: string
    type: string
    id: string
    name: string
    uniqueid: number

    constructor (color, type) {
        this.color = color
        this.type = type
        this.id = this.color + '_' + this.type
        if (this.color === 'red' || this.color === 'green' || this.color === 'yellow' || this.color === 'blue') {
            this.name = this.color + ' ' + this.type
        } else {
            this.name = this.type
        }
        this.uniqueid = cardCounter++
    }
}
