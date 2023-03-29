'use strict'

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 4

const HERO = `<img src="img/player.png">`
const LASER = '<img src="img/laser.png">'
const ALIEN = '<img src="img/baddie1.png">'


var gBoard
var gGame



// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    const size = BOARD_SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()
        }
    }
    return board
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var className = `cell`
            const cell = board[i][j]
            if (cell.gameObject) var innerText = cell.gameObject
            else var innerText = ' '

            strHTML += `<td class="${className}" data-i='${i}' data-j='${j}'>${innerText}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.container')
    elContainer.innerHTML = strHTML
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(type = SKY, gameObject = SKY) {
    return {
        type: type,
        gameObject: gameObject,
    }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, type = SKY, gameObject = SKY) {
    const currCell = gBoard[pos.i][pos.j]
    currCell.type = type
    currCell.gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || '';
}