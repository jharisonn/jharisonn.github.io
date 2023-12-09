//Constants
const GRID_INPUT_INDEX = 0;
const MAIN_MENU = $('#main-menu');
const MAIN_GAME = $('#main-game');
const BOARD = $('#board');

const X_PLAYER = 'X';
const O_PLAYER = 'O';

const CELL_WIDTH = 50;
const CELL_GAP = 5;
const BOARD_SCROLLBOARD_SIZE = 17

//Game Data
let currentPlayer = 'X';
let gridSize = 0;
let answers = [];
let board = [];
let CELLS = $('.cell');
let isGameFinished = true;

const displayMainTitle = (isShown) => {
    MAIN_MENU.css('display', isShown ? 'flex' : 'none');
};

const displayMainGame = (isShown) => {
    MAIN_GAME.css('display', isShown ? 'flex' : 'none');
};

const resetBoard = () => {    
    answers = [];
    board = [];
    isGameFinished = false;
    currentPlayer = X_PLAYER;
    
    $('#winner').css('display', 'none');
    $('#turn').css('display', 'block');
    $('#turn').html(`${currentPlayer} turn.`);
    BOARD.empty();
};

const createCell = (index) => {    
    BOARD.append(`<div class="cell" onclick="makeMove(${index})"></div>`);
};

const generateGrid = () => {
    BOARD.css('width', `${gridSize * CELL_WIDTH + gridSize * CELL_GAP + BOARD_SCROLLBOARD_SIZE}px`);
    BOARD.css('grid-template-columns', `repeat(${gridSize}, min-content)`);

    for (let i = 0; i < gridSize * gridSize; i++) {
        createCell(i);
    }
};

const generateAnswer = () => {
    //Horizontal
    for (let row = 0; row < gridSize; row++) {
        const horizontalAnswer = [];

        for (let column = 0; column < gridSize; column++) {
            horizontalAnswer.push(row * gridSize + column)
        }

        answers.push(horizontalAnswer);
    }

    //Vertical
    for (let row = 0; row < gridSize; row++) {
        const verticalAnswer = [];

        for (let column = 0; column < gridSize; column++) {
            verticalAnswer.push(row + gridSize * column)
        }

        answers.push(verticalAnswer);        
    }

    //Left Diagonal
    const leftDiagonalAnswer = [];

    for (let row = 0; row < gridSize; row++) {
        leftDiagonalAnswer.push(row * gridSize + row);
    }

    answers.push(leftDiagonalAnswer);

    //Right Diagonal
    const rightDiagonalAnswer = [];

    for (let row = 0; row < gridSize; row++) {
        rightDiagonalAnswer.push(row * gridSize + (gridSize - row - 1)); // I subtract 1 to prevent accessing beyond the array's index.
    }

    answers.push(rightDiagonalAnswer);
};

// I generate empty board so it will create row x column size to calculate the winner.
const generateBoard = () => {
    for (let row = 0; row < gridSize * gridSize; row++) {
        board.push('');
    }
};

const startGame = () => {    
    resetBoard();
    generateGrid();
    generateAnswer();
    generateBoard();

    CELLS = $('.cell');
};

const checkWin = () => {    
    for (const answer of answers) {
        const isWin = answer.every(index => board[index] === currentPlayer);

        if (isWin) {            
            return true;
        }
    }

    return false;
}

const checkTie = () => board.every(cell => cell !== '');

const makeMove = (cellIndex) => {
    if (board[cellIndex] !== '') {
        return;
    }

    if (isGameFinished) {
        alert('The game has finished. Reset to play again!');

        return;
    }

    board[cellIndex] = currentPlayer;
    CELLS[cellIndex].innerHTML = currentPlayer;    

    if (checkWin()) {        
        isGameFinished = true;

        $('#turn').css('display', 'none');
        $("#winner").html(`${currentPlayer} is the winner!`);
        $('#winner').css('display', 'block');

        return;
    }

    if (checkTie()) {
        isGameFinished = true;
        
        $('#turn').css('display', 'none');
        $("#winner").html(`The game is tie.`);
        $('#winner').css('display', 'block');

        return;
    }

    currentPlayer = currentPlayer === X_PLAYER ? O_PLAYER : X_PLAYER;
    $('#turn').html(`${currentPlayer} turn.`);
}

const isValidInput = (gridInput) => {
    const isNotEmpty = gridInput !== '';
    const isNumber = !isNaN(gridInput);
    const isNotZero = gridInput !== 0;
    const isGreaterThanEqualThree = gridInput >= 3;

    return isNotEmpty && isNumber && isNotZero && isGreaterThanEqualThree;
};

$('#gameForm').submit((event) => {
    event.preventDefault();

    const gridInput = Number(event.target[GRID_INPUT_INDEX].value);

    if (!isValidInput(gridInput)) {
        alert('Please input correct grid size.');

        return;
    }

    gridSize = gridInput;
    event.target[GRID_INPUT_INDEX].value = 3; //reset value

    startGame();
    displayMainTitle(false);
    displayMainGame(true);
});

$('#resetButton').click(() => {
    startGame();
});

$('#exitButton').click(() => {
    displayMainTitle(true);
    displayMainGame(false);
})