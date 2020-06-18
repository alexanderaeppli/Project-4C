const Card = require('../../classes/Card');

// Shuffle function
function shuffle(array) {
    let currentIndex, randomIndex, temporaryValue;
    currentIndex = array.length;
    temporaryValue = void 0;
    randomIndex = void 0;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Create new deck
module.exports = function createNewDeck(game) {
    let card, color, colors, count, len, i, len1, j, specials;
    CardInventory = {};
    game.deck = [];
    game.stack = [];
    colors = ['red', 'green', 'yellow', 'blue'];
    specials = ['reverse', 'reverse', 'skip', 'skip', '+2', '+2'];
    for (i = 0, len = colors.length; i < len; i++) {
        color = colors[i];
        // Number Cards (with 0)
        count = 0;
        while (count <= 9) {
            game.deck.push(new Card(color, count));
            count++;
        }
        // Number Cards (without 0)
        count = 1;
        while (count <= 9) {
            game.deck.push(new Card(color, count));
            count++;
        }
        // Color special cards
        for (j = 0, len1 = specials.length; j < len1; j++) {
            card = specials[j];
            game.deck.push(new Card(color, card));
            count++;
        }
    }
    // Wildcards
    count = 1;
    while (count <= 4) {
        game.deck.push(new Card('special', 'wildcard'));
        count++;
    }
    // +4 Cards
    count = 1;
    while (count <= 4) {
        game.deck.push(new Card('special', '+4'));
        count++;
    }
    shuffle(game.deck);
}