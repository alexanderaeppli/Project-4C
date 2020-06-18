const socket = io();
import anime from 'animejs/lib/anime.es.js';

// Global variables
let playerName;
let playerHand;

function displayInventory(inventory, playerHand, clickable = true) {
    let card, wrapper, i, len, singleCard;
    wrapper = document.getElementById(inventory);
    wrapper.innerHTML = '';
    for (i = 0, len = playerHand.length; i < len; i++) {
        card = playerHand[i];
        singleCard = document.createElement("div");
        singleCard.className = 'card ' + card.color;
        if (clickable === true) {
            singleCard.setAttribute('data-uniqueid', card.uniqueid);
        }
        singleCard.innerText = card.type;
        wrapper.appendChild(singleCard);
    }

    // Event listener to play cards
    let cards, playerInventory, uniqueid, eventTarget;
    playerInventory = document.getElementById('player__inventory');
    cards = playerInventory.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click',(e) =>  {
            eventTarget = e.target;
            uniqueid = eventTarget.getAttribute('data-uniqueid');
            playCard(uniqueid);
        });
    }
}

function playCard(id) {
    socket.emit('play card', id);
}

function displayEnemyHands(CardInventory) {
    let i, wrapper, singleEnemy, singleEnemyName, singleEnemyDeck;
    wrapper = document.getElementById('enemy__wrapper_inner');
    wrapper.innerHTML = '';
    i = 1;
    for (let [key, value] of Object.entries(CardInventory)) {
        // Filter out enemies
        //if (value.name !== playerName) {
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
    socket.emit('new game');
};

document.getElementById('deck').onclick = function () {
    socket.emit('draw card');
};

// Receive
socket.on('player hand', function (player) {
    playerName = player.name;
    if(typeof playerHand !== 'undefined') {

    }
    displayInventory('player__inventory', player.hand);
});

socket.on('card inventory', function (CardInventory) {
    displayEnemyHands(CardInventory);
})

socket.on('stack', function (stack) {
    displayInventory('stack__inventory', stack, false);
})
