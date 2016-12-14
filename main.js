
const DEBUG = false;

const cardsdata = [  // 24 items
    'cat-1',
    'cat-2',
    'dog-1',
    'dog-2',
    'elephant-1',
    'elephant-2',
    'giraffe-1',
    'giraffe-2',
    'hippo-1',
    'hippo-2',
    'kudu-1',
    'kudu-2',
    'monkey-1',
    'monkey-2',
    'panda-1',
    'panda-2',
    'pig-1',
    'pig-2',
    'seal-1',
    'seal-2',
    'squirrel-1',
    'squirrel-2',
    'zebra-1',
    'zebra-2',
];

const cardsEl = document.getElementById('cards');
const matchCounterEl = document.getElementById('match-counter');
const timeCounterEl = document.getElementById('time-counter');
const turnCounterEl = document.getElementById('turn-counter');
const cards = getRandomCards();

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

    if (cardsTurnedNow >= 2) { // never show more than 2 cards simultaneously.
        conceilAllCards();
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
            increaseMatchCounter(); // Count the match!
            setTimeout(function(){  // Wait for "flip" animation to finish.
                turnedCards[0].classList.add('done');
                turnedCards[1].classList.add('done');
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

function conceilAllCards() {
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
 * Return a list of 24 cards; 12 pairs in random order.
 */
function getRandomCards () {
    // const c = 'A1 A2 B1 B2 C1 C2 D1 D2 E1 E2 F1 F2 G1 G2 H1 H2 I1 I2 J1 J2 K1 K2 L1 L2';
    // return shuffleArray(c.split(' '));
    return shuffleArray(cardsdata);
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