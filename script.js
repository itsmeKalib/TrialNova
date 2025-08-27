let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;  // Start inactive until player clicks Start
let scoreX = 0;
let scoreO = 0;
let streakX = 0;
let streakO = 0;

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const scoreXDisplay = document.getElementById('score-x');
const scoreODisplay = document.getElementById('score-o');
const streakDisplay = document.getElementById('streak');
const startMenu = document.getElementById('start-menu');
const startBtn = document.getElementById('start-btn');
const board = document.getElementById('board');
const resetBtn = document.getElementById('reset');

// Disable board initially (via class & disabled attributes)
board.classList.add('inactive');
cells.forEach(cell => cell.disabled = true);
resetBtn.disabled = true;

// Start game handler
startBtn.addEventListener('click', () => {
  startMenu.style.display = 'none';
  gameActive = true;
  board.classList.remove('inactive');
  cells.forEach(cell => cell.disabled = false);
  resetBtn.disabled = false;
  updateTurnIndicator();
  status.textContent = '';
  resetGame(); // fresh start
});

// Check winner and return winning pattern for explosion effect
function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      gameActive = false;
      updateScores();

      // Add explosion effect on winner cells
      highlightWinnerCells(pattern);

      setTimeout(() => {
        status.textContent = `${gameBoard[a]} wins!`;
        updateStreak(gameBoard[a]);
      }, 200);

      // Disable further clicks on cells
      cells.forEach(cell => cell.disabled = true);
      return pattern;  // return winning pattern
    }
  }

  if (!gameBoard.includes('')) {
    gameActive = false;
    setTimeout(() => {
      status.textContent = "It's a draw!";
    }, 200);
    // Disable further clicks on cells
    cells.forEach(cell => cell.disabled = true);
  }
}

// Add explosion animation class to winning cells, then remove after animation
function highlightWinnerCells(pattern) {
  pattern.forEach(i => {
    const cell = cells[i];
    cell.classList.add('winner-explosion');
  });
  // Remove explosion class after animation ends to reset
  setTimeout(() => {
    pattern.forEach(i => {
      cells[i].classList.remove('winner-explosion');
    });
  }, 1800); // 3 loops of 0.6s animation = 1.8s
}

function handleCellClick(event) {
  const index = event.target.getAttribute('data-index');
  if (gameBoard[index] || !gameActive) return;

  gameBoard[index] = currentPlayer;
  event.target.textContent = currentPlayer;

  // Add class for X or O
  if (currentPlayer === 'X') {
    event.target.classList.add('x');
  } else {
    event.target.classList.add('o');
  }

  checkWinner();
  if (gameActive) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
  updateTurnIndicator();
}

function updateScores() {
  if (currentPlayer === 'X') {
    scoreX++;
  } else {
    scoreO++;
  }
  scoreXDisplay.textContent = scoreX;
  scoreODisplay.textContent = scoreO;
}

function updateStreak(winner) {
  if (winner === 'X') {
    streakX++;
    streakO = 0;
  } else {
    streakO++;
    streakX = 0;
  }
  streakDisplay.textContent = `X: ${streakX} | O: ${streakO}`;
}

function updateTurnIndicator() {
  const turnIndicator = document.getElementById('turn-indicator');
  if (turnIndicator) {
    turnIndicator.remove();
  }

  const newTurnIndicator = document.createElement('div');
  newTurnIndicator.id = 'turn-indicator';
  newTurnIndicator.classList.add('turn-indicator');

  if (!gameActive) {
    newTurnIndicator.textContent = "Game not started";
    newTurnIndicator.classList.remove('x-turn', 'o-turn');
  } else if (currentPlayer === 'X') {
    newTurnIndicator.classList.add('x-turn');
    newTurnIndicator.textContent = "Player X's turn";
  } else {
    newTurnIndicator.classList.add('o-turn');
    newTurnIndicator.textContent = "Player O's turn";
  }

  document.querySelector('.game-container').insertBefore(newTurnIndicator, document.querySelector('.board'));
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  status.textContent = '';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'winner-explosion');
    cell.disabled = false;
  });
  updateTurnIndicator();
}

// Event listeners for cell clicks
cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

// Reset button resets but does not hide start menu
resetBtn.addEventListener('click', () => {
  if (!gameActive) {
    // If game inactive (like after win/draw), enable cells again
    cells.forEach(cell => cell.disabled = false);
  }
  resetGame();
});

// Initialize turn indicator before game start
updateTurnIndicator();
