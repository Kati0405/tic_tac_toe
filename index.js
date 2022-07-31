const winningCombos = [
    ['0','1', '2'],
    ['3', '4', '5'],
    ['6', '7', '8'],
    ['0', '3', '6'],
    ['1', '4', '7'],
    ['2', '5', '8'],
    ['0', '4', '8'],
    ['2', '4', '6']
];

let currentTurn = 'O';
let gameOver = false;
let board = ['', '', '', '', '', '', '', '', ''];
let cursorPosition;

function createBoard() {
    let container = document.querySelector('.container');

    for (let i = 0; i < 9; i++) {
        let tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = 'tile_' + i.toString();
        container.appendChild(tile);
    }
}

document.addEventListener('DOMContentLoaded', createBoard);

function refreshPage() {
    window.location.reload();
}

window.onload = function () {
    let container = document.querySelector('.container');
    container.addEventListener('click', playGame);
    let resetBtn = document.getElementById('reset');
    resetBtn.addEventListener('click', refreshPage);

    dragAndDrop();

    let enterEvent = new CustomEvent('enterEvent');
    function eventHandler() {
        document.getElementById('tile_' + cursorPosition).click();
    }
    let elem = document;
    elem.addEventListener('enterEvent', eventHandler);

    elem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            elem.dispatchEvent(enterEvent);
        }
        if (e.key === 'ArrowRight') {
            changeCursorPosition(1);
        }
        if (e.key === 'ArrowLeft') {
            changeCursorPosition(-1);
        }
    });
};

function changeCursorPosition(cursorPadding) {
    if (cursorPosition !== undefined) {
        if (
            cursorPadding === 1 && cursorPosition < 8 ||
            cursorPadding === -1 && cursorPosition > 0
        ) {
            cursorPosition += cursorPadding;
        }
        document
            .getElementById('tile_' + (cursorPosition - cursorPadding))
            .classList.remove('active');
    } else {
        cursorPosition = 0;
    }
    document.getElementById('tile_' + cursorPosition).classList.add('active');
}

function playGame(e) {
    if (e.target && e.target.className.split(' ')[0] === 'tile') {
        if (!gameOver) {
            let idx = parseInt(e.target.id.split('_')[1]);
            currentTurn = otherTurn(currentTurn);
            e.target.innerText = currentTurn;
            board[idx] = currentTurn;

            if (checkWin(board)) {
                alertWin(currentTurn);
                gameOver = true;
            }
            e.target.classList.add('player' + currentTurn);
            changeCurrentTurn(currentTurn);
        }
    }
}

function alertWin(winner) {
    document.querySelector(
        '.announcer'
    ).innerHTML = `<span>Player</span> <span class='player${winner}'> ${winner} won</span>`;
    document.querySelector('.announcer').classList.remove('hide');
}

function otherTurn(turn) {
    return turn === 'O' ? 'X' : 'O';
}

function changeCurrentTurn(prevTurn) {
    let nextTurn = otherTurn(prevTurn);
    document
        .querySelector('.display-player')
        .classList.remove('player' + prevTurn);
    document
        .querySelector('.display-player')
        .classList.add('player' + nextTurn);
    document.querySelector('.display-player').innerText = nextTurn;
}

function checkWin(board) {
    let win;
    for (let combo of winningCombos) {
        win =
            board[combo[0]] &&
            board[combo[0]] === board[combo[1]] &&
            board[combo[0]] === board[combo[2]];
        if (win) {
            break;
        }
    }
    return win;
}

function dragAndDrop() {
    for (let i = 0; i < document.querySelectorAll('.avatar-icon').length; i++) {
        let avatar = document.querySelectorAll('.avatar-icon');
        avatar[i].classList.add('draggable');
        avatar[i].setAttribute('draggable', true);
    }
    let draggables = document.querySelectorAll('.draggable');
    let containers = document.querySelectorAll('.avatar-container');

    draggables.forEach((draggable) => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    containers.forEach((container) => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (container.hasChildNodes()) {
                return;
            }
            const draggable = document.querySelector('.dragging');
            container.appendChild(draggable);
        });
    });
}
