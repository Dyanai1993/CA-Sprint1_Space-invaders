'use strict'

const ALIEN_SPEED = 777;
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row

var gAlien
var gIsAlienFreeze = true;



function createAliens(board) {
    for (var i = gAlien.topRowIdx; i < ALIENS_ROW_COUNT + gAlien.topRowIdx; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            var species
            switch (i) {
                case 1:
                    species = ALIEN1
                    break
                case 2:
                    species = ALIEN2
                    break
                case 3:
                case 4:
                    species = ALIEN3
                    break
            }
            board[i][j] = createCell(ALIEN, species)
            gGame.aliensCount++
        }
    }
}

function killAlien(pos) {
    switch (gBoard[pos.i][pos.j].gameObject) {
        case ALIEN1:
            gGame.score += 20
            break
        case ALIEN2:
            gGame.score += 15
            break
        case ALIEN3:
            gGame.score += 10
            break
    }
    updateCell(pos)
    gGame.aliensCount--
    if (gGame.aliensCount === 0) gameFinish(true)
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = BOARD_SIZE-1; j >= 0; j--) {
            var currPos = { i: i, j: j }
            var nextPos = { i: i, j: j + 1 }
            var currCell =  gBoard[currPos.i][currPos.j]
            var nextCell = gBoard[nextPos.i][nextPos.j]
            if (currCell.type !== ALIEN) continue
            if (nextCell.type === LASER) {
                updateCell(currPos)
                updateCell(nextPos, ALIEN, species)
                killAlien(nextPos)
                continue
            } else if (nextCell.type === ROCK) removeRock(nextPos)
            else if (nextCell.type === BUNKER) removeBunker(nextPos)
            var species = gBoard[i][j].gameObject
            updateCell(currPos)
            updateCell(nextPos, ALIEN, species)
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = 0; j <= BOARD_SIZE-1; j++) {
            var currPos = { i, j }
            var nextPos = { i: i, j: j - 1 }
            var currCell =  gBoard[currPos.i][currPos.j]
            var nextCell = gBoard[nextPos.i][nextPos.j]
            if (currCell.type !== ALIEN) continue
            if (nextCell.type === LASER) {
                updateCell(currPos)
                updateCell(nextPos, ALIEN, species)
                killAlien(nextPos)
                continue
            } else if (nextCell.type === ROCK) removeRock(nextPos)
            else if (nextCell.type === BUNKER) removeBunker(nextPos)
            var species = gBoard[i][j].gameObject
            updateCell(currPos)
            updateCell(nextPos, ALIEN, species)
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = fromI; i >= toI; i--) {
        for (var j = 0; j <= BOARD_SIZE-1; j++) {
            var currPos = { i, j }
            var nextPos = { i: i + 1, j }
            var currCell =  gBoard[currPos.i][currPos.j]
            var nextCell = gBoard[nextPos.i][nextPos.j]
            if (currCell.type !== ALIEN) continue
            if (nextCell.type === LASER) {
                updateCell(currPos)
                updateCell(nextPos, ALIEN, species)
                killAlien(nextPos)
                continue
            } else if (nextCell.type === ROCK) removeRock(nextPos)
            if (nextCell.type === BUNKER) removeBunker(nextPos)
            var species = gBoard[i][j].gameObject
            updateCell(currPos)
            updateCell(nextPos, ALIEN, species)
            if (gAlien.lastRow < i + 1) gAlien.lastRow = i + 1
        }
    }
    gAlien.topRowIdx++
    if (gAlien.lastRow === gAlien.bottomRowIdx) gameFinish(false)
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    if (!gGame.isOn) return
    if (gAlien.isFrozen) return
    gAlien.speedInterval = setInterval(() => {
        if (gAlien.isFrozen) return
        if (gAlien.moveCount >= 0 && gAlien.moveCount < 6) {
            shiftBoardRight(gBoard, gAlien.topRowIdx, gAlien.bottomRowIdx) //right
            gAlien.moveCount++
        } else if (gAlien.moveCount === 6) {
            shiftBoardDown(gBoard, gAlien.bottomRowIdx, gAlien.topRowIdx) //down
            gAlien.moveCount++
        } else if (gAlien.moveCount > 6 && gAlien.moveCount <= 12) {
            shiftBoardLeft(gBoard, gAlien.topRowIdx, gAlien.bottomRowIdx) //left
            gAlien.moveCount++
        } else {
            shiftBoardDown(gBoard, gAlien.bottomRowIdx, gAlien.topRowIdx) //down
            gAlien.moveCount = 0
        }
    }, ALIEN_SPEED);
}

