var socket;

socket = io();

function displayPlayerHand(playerHand) {
    var card, deckWrapper, i, len, singleCard;
    deckWrapper = document.getElementById('player__inventory');
    deckWrapper.innerHTML = '';
    for (i = 0, len = playerHand.length; i < len; i++) {
        card = playerHand[i];
        singleCard = document.createElement("div");
        singleCard.id = card.id;
        singleCard.innerText = card.name;
        deckWrapper.appendChild(singleCard);
    }
}

function displayEnemyHands(CardInventory) {

}

socket.emit('new player');

document.getElementById('reset_btn').onclick = function () {
    console.log('click');
    return socket.emit('new game');
};

socket.on('player hand', function (playerHand) {
    console.log('received');
    console.log(playerHand);
    displayPlayerHand(playerHand);
});

socket.on('card inventory', function (CardInventory) {
    console.log(CardInventory);
    displayEnemyHands(CardInventory)
})