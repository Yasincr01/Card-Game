const gameBoard = document.getElementById('gameBoard');
const scoreBoard = document.getElementById('scoreBoard');
const movesBoard = document.getElementById('movesBoard');

// Array of card values (matching pairs)
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Duplicate and shuffle card values
let cards = shuffle([...cardValues, ...cardValues]);

let firstCard = null;
let secondCard = null;
let lockBoard = false;  // To prevent clicking while two cards are being checked
let score = 0;
let movesLeft = 18;  // Maximum number of allowed moves

// Update score and moves
function updateScore() {
  scoreBoard.innerText =` Score: ${score}`;
}

function updateMoves() {
  movesBoard.innerText = `Moves Left: ${movesLeft}`;
  if (movesLeft == 0) {
    endGame('Game Over! You are out of moves.');
  }
}

// Create card elements on the game board
function createBoard() {
  gameBoard.innerHTML = '';
  cards.forEach(value => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.innerText = '?';  // Hidden face of the card
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

// Shuffle function to randomize the cards
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Handle card flipping
function flipCard() {
  if (lockBoard) return; // Don't allow further clicks during the check phase
  if (this == firstCard) return; // Ignore if clicking the same card twice
  if (movesLeft <= 0) return;  // No more moves allowed

  this.classList.add('flipped');
  this.innerText = this.dataset.value;

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lockBoard = true;  // Lock board while checking cards
    movesLeft--;  // Decrease moves
    updateMoves();
    checkForMatch();
  }
}

// Check if two flipped cards match
function checkForMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    score++;
    updateScore();
    disableCards();
    if (score == cardValues.length) {
      endGame('Congratulations! You found all matches!');
    }
  } else {
    unflipCards();
  }
}

// Disable cards if they match
function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  resetBoard();
}

// Unflip cards if they do not match
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard.innerText = '?';
    secondCard.innerText = '?';
    resetBoard();
  }, 1000);
}

// Reset board state after a match/no match
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// End the game with a message
function endGame(message) {
  setTimeout(() => {
    alert(message);
    resetGame();
  }, 500);
}

// Reset the game to start over
function resetGame() {
  score = 0;
  movesLeft = 15;
  updateScore();
  updateMoves();
  cards = shuffle([...cardValues, ...cardValues]);
  createBoard();
}

// Start the game
createBoard();
updateScore();
updateMoves();