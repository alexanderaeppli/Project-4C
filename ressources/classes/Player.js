class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
    }

    giveCards(quantity, deck) {
        this.hand = this.hand.concat(deck.slice(0, quantity));
        deck = deck.slice(quantity);
        this.hand.sort(function (a, b) {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
        })
    }

    playCard(card, stack) {
        let playedCard = this.hand.find(obj => obj.uniqueid === card);
        let playedCardIndex = this.hand.findIndex(obj => obj.uniqueid === card);
        stack.push(playedCard);
        this.hand.splice(playedCardIndex, 1);
    }

    resetHand() {
        this.hand = [];
    }
}
module.exports = Player