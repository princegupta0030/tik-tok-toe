const cells = document.querySelectorAll('.cell');
const messageDisplay = document.querySelector('.message');
const resetButton = document.querySelector('.reset-button');
const resetScoresButton = document.querySelector('.reset-scores-button');
const themeSelect = document.getElementById('theme-select');
const xScoreDisplay = document.getElementById('x-score');
const oScoreDisplay = document.getElementById('o-score');
const drawScoreDisplay = document.getElementById('draw-score');
const xPlayerIndicator = document.querySelector('.x-player');
const oPlayerIndicator = document.querySelector('.o-player');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let xWins = 0;
let oWins = 0;
let draws = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Load saved data from localStorage
function loadSavedData() {
    // Load theme
    const savedTheme = localStorage.getItem('ticTacToeTheme');
    if (savedTheme) {
        document.body.className = savedTheme;
        themeSelect.value = savedTheme;
    }

    // Load scores
    const savedXWins = localStorage.getItem('ticTacToeXWins');
    const savedOWins = localStorage.getItem('ticTacToeOWins');
    const savedDraws = localStorage.getItem('ticTacToeDraws');

    if (savedXWins) xWins = parseInt(savedXWins);
    if (savedOWins) oWins = parseInt(savedOWins);
    if (savedDraws) draws = parseInt(savedDraws);

    updateScoreDisplay();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('ticTacToeTheme', document.body.className);
    localStorage.setItem('ticTacToeXWins', xWins);
    localStorage.setItem('ticTacToeOWins', oWins);
    localStorage.setItem('ticTacToeDraws', draws);
}

// Theme switching
themeSelect.addEventListener('change', (e) => {
    document.body.className = e.target.value;
    saveData();
});

// Update score display
function updateScoreDisplay() {
    xScoreDisplay.textContent = xWins;
    oScoreDisplay.textContent = oWins;
    drawScoreDisplay.textContent = draws;
}

// Update player indicator
function updatePlayerIndicator() {
    if (currentPlayer === 'X') {
        xPlayerIndicator.classList.add('active');
        oPlayerIndicator.classList.remove('active');
    } else {
        oPlayerIndicator.classList.add('active');
        xPlayerIndicator.classList.remove('active');
    }
}

// Celebration animation
function triggerCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    document.body.appendChild(celebration);

    const colors = [getComputedStyle(document.body).getPropertyValue('--x-color'),
                    getComputedStyle(document.body).getPropertyValue('--o-color'),
                    getComputedStyle(document.body).getPropertyValue('--highlight-color')];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        celebration.appendChild(confetti);
    }

    setTimeout(() => {
        celebration.remove();
    }, 5000);
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.textContent = currentPlayer;

    checkWin();
    if (gameActive) {
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    messageDisplay.textContent = `It's ${currentPlayer}'s turn`;
    updatePlayerIndicator();
}

function checkWin() {
    let roundWon = false;
    let winningIndices = [];

    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameBoard[winCondition[0]];
        const b = gameBoard[winCondition[1]];
        const c = gameBoard[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningIndices = winCondition;
            break;
        }
    }

    if (roundWon) {
        messageDisplay.textContent = `${currentPlayer} wins!`;
        gameActive = false;

        // Highlight winning cells
        winningIndices.forEach(index => {
            cells[index].classList.add('winning-cell');
        });

        // Update score
        if (currentPlayer === 'X') {
            xWins++;
        } else {
            oWins++;
        }
        updateScoreDisplay();
        saveData();

        // Trigger celebration
        triggerCelebration();

        return;
    }

    if (!gameBoard.includes('')) {
        messageDisplay.textContent = "It's a draw!";
        gameActive = false;
        draws++;
        updateScoreDisplay();
        saveData();
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    messageDisplay.textContent = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x');
        cell.classList.remove('o');
        cell.classList.remove('winning-cell');
    });
    updatePlayerIndicator();
}

function resetScores() {
    xWins = 0;
    oWins = 0;
    draws = 0;
    updateScoreDisplay();
    saveData();
    messageDisplay.textContent = 'Scores reset!';
    setTimeout(() => {
        if (gameActive) {
            messageDisplay.textContent = `It's ${currentPlayer}'s turn`;
        }
    }, 1500);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
resetScoresButton.addEventListener('click', resetScores);

// Initialize
loadSavedData();
messageDisplay.textContent = `It's ${currentPlayer}'s turn`;
updatePlayerIndicator();
