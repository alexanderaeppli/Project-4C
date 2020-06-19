class Player {
    constructor(name = 'Player') {
        this.name = name;
        this.hand = [];
    }

    giveCards(quantity, deck) {
        this.hand = this.hand.concat(deck.slice(0, quantity));
        deck = deck.slice(quantity);
        this.hand.sort(function (a, b) {
            if (a.uniqueid < b.uniqueid) {
                return -1;
            }
            if (a.uniqueid > b.uniqueid) {
                return 1;
            }
        })
        return deck;
    }

    playCard(card, stack) {
        let playedCard = this.hand.find(obj => obj.uniqueid === card);
        let playedCardIndex = this.hand.findIndex(obj => obj.uniqueid === card);
        if (playedCard !== undefined) {
            // Bugfix: When the first card is played an undefined object is created (somehow) and added to the stack, breaking the game. Hence the condition.
            this.hand.splice(playedCardIndex, 1);
            stack.push(playedCard);
        }
        return stack;
    }

    resetHand() {
        this.hand = [];
    }
}
module.exports = Player