var socket = io();

function displayInventory(inventory, playerHand, clickable = true) {
    var card, wrapper, i, len, singleCard;
    wrapper = document.getElementById(inventory);
    wrapper.innerHTML = '';
    for (i = 0, len = playerHand.length; i < len; i++) {
        card = playerHand[i];
        singleCard = document.createElement("div");
        singleCard.id = card.id;
        singleCard.className = 'card '+ card.color;
        if (clickable === true) {
            singleCard.setAttribute('onclick', 'playCard("'+ card.uniqueid +'")');
        }
        singleCard.innerText = card.type;
        wrapper.appendChild(singleCard);
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

document.getElementById('deck').onclick = function () {
    //console.log('click');
    socket.emit('draw card');
};

// Receive
socket.on('player hand', function (playerHand) {
    //console.log(playerHand);
    displayInventory('player__inventory', playerHand);
});

socket.on('card inventory', function (CardInventory) {
    //console.log(CardInventory);
    displayEnemyHands(CardInventory)
})

socket.on('stack', function (stack) {
    //console.log(stack);
    displayInventory('stack__inventory', stack, false);
})
