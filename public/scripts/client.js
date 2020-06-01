var socket = io();

function displayPlayerHand(playerHand) {
    var card, deckWrapper, i, len, singleCard;
    deckWrapper = document.getElementById('player__inventory');
    deckWrapper.innerHTML = '';
    for (i = 0, len = playerHand.length; i < len; i++) {
        card = playerHand[i];
        singleCard = document.createElement("div");
        singleCard.id = card.id;
        singleCard.className = 'card';
        singleCard.setAttribute('onclick', 'playCard("'+ card.uniqueid +'")');
        singleCard.innerText = card.name;
        deckWrapper.appendChild(singleCard);
    }
}
function displayStack(stack) {
    var card, stackWrapper, i, len, singleCard;
    stackWrapper = document.getElementById('stack__inventory');
    stackWrapper.innerHTML = '';
    for (i = 0, len = stack.length; i < len; i++) {
        card = stack[i];
        singleCard = document.createElement("div");
        singleCard.id = card.id;
        singleCard.className = 'card';
        singleCard.setAttribute('onclick', 'playCard("'+ card.uniqueid +'")');
        singleCard.innerText = card.name;
        stackWrapper.appendChild(singleCard);
    }
}


function playCard(id) {
    socket.emit('play card', id);
}

function displayEnemyHands(CardInventory) {

}

// Emit
socket.emit('new player');

document.getElementById('reset_btn').onclick = function () {
    //console.log('click');
    socket.emit('new game');
};

// Receive
socket.on('player hand', function (playerHand) {
    //console.log(playerHand);
    displayPlayerHand(playerHand);
});

socket.on('card inventory', function (CardInventory) {
    //console.log(CardInventory);
    displayEnemyHands(CardInventory)
})

socket.on('stack', function (stack) {
    //console.log(stack);
    displayStack(stack);
})
