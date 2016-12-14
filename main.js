
const DEBUG = false;

const cardnames = ['cat', 'dog', 'elephant', 'giraffe', 'hippo', 'kudu', 'monkey', 'panda', 'pig', 'seal', 'squirrel', 'zebra'];
const okOverlayEl = document.getElementById('okay-overlay');
const cardsEl = document.getElementById('cards');
const matchCounterEl = document.getElementById('match-counter');
const timeCounterEl = document.getElementById('time-counter');
const turnCounterEl = document.getElementById('turn-counter');
const cards = getRandomCards(cardnames);

let cardsTurnedNow, turnCounter, matchCounter, timeCounter, timeCounterInterval;

init();

function init () {
    cardsTurnedNow = 0; // State of current turn move, 1 or 2 cards flipped?
    matchCounter = 0; // How many matching pair were found so far?
    turnCounter = 0;  // How many card pairs were turned?
    resetTimeCounter();
    startTimeCounter();
    render();
}

function render () {
    for (let i=0; i<cards.length; i++) {
        let divCard = document.createElement('div');
        let divFront = document.createElement('div');
        let divBack = document.createElement('div');
        let txFront = document.createTextNode('Front: ' + cards[i]); // Front-side content
        let txBack = document.createTextNode('Front: ' + cards[i]); // Back-side content

        divCard.setAttribute('data-id', cards[i]); // Set card id on the element.
        divCard.classList.add('card');
        divFront.style.backgroundImage = 'url(' + cards[i] + '.jpg)';
        divFront.classList.add('front');
        divBack.classList.add('back');

        if (DEBUG) {
            divFront.appendChild(txFront);
            divBack.appendChild(txBack);
        }

        divCard.appendChild(divFront);
        divCard.appendChild(divBack);

        divCard.addEventListener('click', handleTurnCard);
        cardsEl.appendChild(divCard);
    }
}

function handleTurnCard(event) {
    const cardEl = event.target.parentElement;

    // If there are already two cards turned, then conceal them.
    if (cardsTurnedNow >= 2) {
        concealAllCards();
        return;
    }

    if ( ! cardEl.classList.contains('front-visible')) {
        cardEl.classList.remove('front-concealed');
        cardEl.classList.add('front-visible');
        cardsTurnedNow++;
    }

    // Check if there is a matching pair of cards.
    if (cardsTurnedNow == 2) {
        increaseTurnCounter(); // Count the turned pair.
        const turnedCards = cardsEl.getElementsByClassName('front-visible');
        const id1 = turnedCards[0].getAttribute('data-id');
        const id2 = turnedCards[1].getAttribute('data-id');

        if (id1.split('-')[0] === id2.split('-')[0]) {
            okOverlayEl.classList.add('show');
            increaseMatchCounter(); // Count the match!
            turnedCards[0].style.pointerEvents = 'none';
            turnedCards[1].style.pointerEvents = 'none';
            setTimeout(function(){  // Wait for "flip" animation to finish.
                turnedCards[0].classList.add('done');
                turnedCards[1].classList.add('done');
                setTimeout(function(){  // Wait for "disappear" animation to semi-finish.
                    okOverlayEl.classList.remove('show');
                }, 1000);
            }, 1500);
        }
    }
}

function increaseMatchCounter() {
    matchCounter++;
    matchCounterEl.textContent = matchCounter;
}

function increaseTurnCounter() {
    turnCounter++;
    turnCounterEl.textContent = turnCounter;
}

function startTimeCounter() {
    timeCounterInterval = setInterval(function() {
        timeCounter++;
        timeCounterEl.textContent = timeCounter;
    }, 1000);
}

function resetTimeCounter() {
    if (timeCounterInterval) clearInterval(timeCounterInterval);
    timeCounter = 0;
    timeCounterEl.textContent = '0';
}

function restartGame() {
    init();
}

function concealAllCards() {
    const cardEls = cardsEl.getElementsByClassName('card');

    for (let i=0; i<cardEls.length; i++) {
        if (cardEls[i].classList.contains('front-visible')) {
            cardEls[i].classList.remove('front-visible');
            cardEls[i].classList.add('front-concealed');
        }
    }

    cardsTurnedNow = 0; // reset visible cards counter.
}

/**
 * Receives an array of card names and converts it into pairs, with
 * each name having "-1" and "-2" appended. Then return the array 
 * of cards in random order.
 */
function getRandomCards (names) {
    let arr = [];
    for (let i=0; i<names.length; i++) {
        arr.push(names[i] + '-1');
        arr.push(names[i] + '-2');
    }
    return shuffleArray(arr);
}

/**
 * Randomize array element order, using Durstenfeld shuffle algorithm.
 */
function shuffleArray (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}