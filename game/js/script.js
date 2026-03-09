const symbols = ['♠', '♣', '♥', '♦'];
const values = ['9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];

let maxCARD = 5;

let hand = Array(maxCARD).fill(null); // Miejsce na 6 kart

let currentRound = 0;
let drawCount = 0;
let totalScore = 0;

let roundMAX = 10;
let drawMAX = 5;

const categories = [
    { name: "9", used: false },
    { name: "10", used: false },
    { name: "J", used: false },
    { name: "D", used: false },
    { name: "K", used: false },
    { name: "A", used: false },
    { name: "3", used: false },
    { name: "4", used: false },
    { name: "9-K", used: false },
    { name: "10-A", used: false }
];

function initCategories() {
    const container = document.getElementById('category-buttons');
    const br = document.createElement('br');
    container.innerHTML = '<br>';
    categories.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.className = 'information-containter-btn';
        btn.innerText = cat.name;
        btn.disabled = cat.used;
        btn.onclick = () => selectCategory(index);
        container.appendChild(btn);
        container.append(document.createElement('br'));
    });
}

function getPioints(categoryName){
    let points = 0;
    const valuesMap = { 'J': 11, 'D': 12, 'K': 13, 'A': 14 };
    
    const handValues = hand.filter(c => c.selected === true).map(c => c.v);
    const handCounts = {};
    
    handValues.forEach(v => {
        const val = valuesMap[v] || parseInt(v);
        handCounts[val] = (handCounts[val] || 0) + 1;
    });
    
    console.log(handValues);
    
    switch (categoryName) {
        case '9': points = (handCounts[9] || 0) * 9; break;
        case '10': points = (handCounts[10] || 0) * 10; break;
        case 'J': points = (handCounts[11] || 0) * 11; break;
        case 'D': points = (handCounts[12] || 0) * 12; break;
        case 'K': points = (handCounts[13] || 0) * 13; break;
        case 'A': points = (handCounts[14] || 0) * 14; break;
        case '3': const tripleValue = Object.keys(handCounts).find(v => handCounts[v] >= 3); points = tripleValue ? (valuesMap[tripleValue] || parseInt(tripleValue)) * 3 : 0; break;
        case '4': points = Object.values(handCounts).some(c => c === 4) ? handValues.reduce((sum, v) => sum + (valuesMap[v] || parseInt(v)), 0) : 0; break;
        case '10-A': points = handValues.every(v => ['10','J','D','K','A'].includes(v)) ? 40 : 0; break;
        case '9-K': points = handValues.every(v => ['9','10','J','D','K'].includes(v)) ? 20 : 0; break;
    }

    return points;
}

function selectCategory(index){
    if (categories[index].used) return;

    const points = getPioints(categories[index].name);
    totalScore += points;
    categories[index].used = true;

    document.getElementById('scoreboard').innerText = `Wynik: ${totalScore}`;
    
    roundTracer();
    updateRoundInfo();
    initCategories(); // odśwież przyciski
    resetGame(); // nowa runda

    if (currentRound > roundMAX) {
        alert(`Koniec gry! Twój wynik: ${totalScore}`);
    }
}

function roundTracer(){
    currentRound++;
    
    if (currentRound > roundMAX){
        resetGame();
        startGame();
    }
    
}

function updateRoundInfo() {
    document.getElementById('round-info').innerText =
        `Runda: ${currentRound} / ${roundMAX} | Losowań: ${drawCount} / ${drawMAX})`;
}

function createDeck() {
    deck = [];
    symbols.forEach(s => values.forEach(v => deck.push({ v, s })));
    shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function handleDraw() {
    if (deck.length === 0) createDeck();
    
    if (drawCount >= drawMAX){
        return
    }
    
    // zwróć niezaznaczone karty do talii
    hand.forEach((card, index) => {
        if (card && !card.selected) {
            deck.push({ v: card.v, s: card.s });
            hand[index] = null;
        }
    });
    
    drawCount++;
    updateRoundInfo();
    shuffle(deck);
    renderHand();
}

function renderHand() {
    const container = document.getElementById('hand-container');
    
    hand.forEach((card, index) => {
        // Jeśli miejsce jest puste (bo karta wróciła do talii), dolosuj nową
        if (!card) {
            const newCard = { ...deck.pop(), selected: false };
            hand[index] = newCard;
            
            // Stwórz element DOM z opóźnieniem dla efektu animacji
            setTimeout(() => createCardElement(newCard, index), index * 100);
        }
    });
}

function createCardElement(cardData, index) {
    const container = document.getElementById('hand-container');
    
    // Jeśli karta już istnieje w DOM (z poprzedniego losowania), nie twórz nowej
    let cardDiv = container.children[index];
    if (!cardDiv) {
        cardDiv = document.createElement('div');
        container.appendChild(cardDiv);
    }

    cardDiv.className = 'card dealing'; // Start animacji
    cardDiv.innerHTML = `${cardData.v}${cardData.s}`;
    cardDiv.style.color = (cardData.s === '♥' || cardData.s === '♦') ? 'red' : 'black';
    
    cardDiv.onclick = () => {
        cardData.selected = !cardData.selected;
        cardDiv.classList.toggle('selected', cardData.selected);
    };

    // Usuń klasę 'dealing' by wywołać przejście CSS do pozycji docelowej
    requestAnimationFrame(() => {
        cardDiv.classList.remove('dealing');
        if (cardData.selected) cardDiv.classList.add('selected');
    });
}

function resetGame() {
    document.getElementById('hand-container').innerHTML = '';
    hand = Array(maxCARD).fill(null);
    createDeck();
    drawCount = 0;
}

function startGame(){
    currentRound=1;
    totalScore = 0;
    document.getElementById('round-info').innerText =`Runda: ${currentRound} / ${roundMAX} | Losowań: ${drawCount} / ${drawMAX})`;
    document.getElementById('scoreboard').innerText = `Wynik: ${totalScore}`;
    
    categories.forEach(restartCategories);
    initCategories()
    
}

function restartCategories(item, index){
    item.used = false;
}

function restartGame(){
    resetGame();
    startGame();
}

// Start gry
initCategories();
createDeck();
startGame();
