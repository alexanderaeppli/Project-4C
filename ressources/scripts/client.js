const socket = io();
const anime = require('animejs');

let userName;

function displayInventory(inventory, playerHand, clickable = true) {
    var card, wrapper, i, len, singleCard;
    wrapper = document.getElementById(inventory);
    wrapper.innerHTML = '';
    for (i = 0, len = playerHand.length; i < len; i++) {
        card = playerHand[i];
        singleCard = document.createElement("div");
        singleCard.className = 'card ' + card.color;
        if (clickable === true) {
            singleCard.setAttribute('onclick', 'playCard("' + card.uniqueid + '")');
        }
        singleCard.innerText = card.type;
        wrapper.appendChild(singleCard);
    }
}

function playCard(id) {
    socket.emit('play card', id);
}

function displayEnemyHands(CardInventory) {
    let i, wrapper, len, singleCard;
    wrapper = document.getElementById('enemy__wrapper_inner');
    wrapper.innerHTML = '';
    i = 1;
    for (let [key, value] of Object.entries(CardInventory)) {
        // Filter out enemies
        //if (value.name !== userName) {
        // Create Enemy Wrapper
        singleEnemy = document.createElement("div");
        singleEnemy.classList.add('player_' + i, 'enemy');
        // Create enemy nametag
        singleEnemyName = document.createElement("div");
        singleEnemyName.innerText = value.name;
        singleEnemy.appendChild(singleEnemyName);
        // Create enemy deck
        singleEnemyDeck = document.createElement("div");
        singleEnemyDeck.className = 'enemy__deck'
        singleEnemyDeck.innerText = value.hand;
        // while (--value.hand) {
        //     singleCard = document.createElement("div");
        //     singleCard.className = 'enemy__card<';
        //     singleEnemyDeck.appendChild(singleCard);
        // }
        singleEnemy.appendChild(singleEnemyDeck);
        wrapper.appendChild(singleEnemy);
        //}
    }
    socket.emit('card inventory', CardInventory);
}

// Emit
socket.emit('new player');

document.getElementById('reset_btn').onclick = function () {
    //console.log('click');
    socket.emit('new game');
};

document.getElementById('deck').onclick = function () {
    //console.log('click');
    socket.emit('draw card');
};

// Receive
socket.on('player hand', function (player) {
    userName = player.name;
    displayInventory('player__inventory', player.hand);
});

socket.on('card inventory', function (CardInventory) {
    //console.log(CardInventory);
    displayEnemyHands(CardInventory)
})

socket.on('stack', function (stack) {
    //console.log(stack);
    displayInventory('stack__inventory', stack, false);
})