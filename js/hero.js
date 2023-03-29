'use strict'

var gHero



// creates the hero and place it on board
function createHero(board) {
    board[gHero.pos.i][gHero.pos.j] = createCell(HERO, HERO)
}

// creates the hero and place it on board
function createHero(board) {
    board[gHero.pos.i][gHero.pos.j] = createCell(HERO, HERO)
}


function onKeyDown(ev) {
    if (!gGame.isOn) return
    switch (ev.key) {
        case 'ArrowLeft':
            if (gHero.pos.j > 0) {
                moveHero('left')
            }
            break
        case 'ArrowRight':
            if (gHero.pos.j < BOARD_SIZE - 1) {
                moveHero('right')
            }
            break
    }
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    updateCell(gHero.pos)
    if (dir === 'right') gHero.pos.j++
    else if (dir === 'left') gHero.pos.j--
    if (gBoard[gHero.pos.i][gHero.pos.j].type === ROCK) {
        removeLife()
        gAlien.isThrowingRock = false
    }
    updateCell(gHero.pos, HERO, HERO)
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function handleShoot(pos) {
    var pos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    playSound('shoot')
    if (gBoard[pos.i][pos.j].type === ROCK) removeRock(pos)
    gHero.laserPos = pos
    gHero.isLaser = true
    blinkLaser(pos)
    checkHit(pos)
    setShootInterval(pos)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    var currCell = gBoard[pos.i][pos.j]
    var laserObject = (gHero.superOn) ? FAST_LASER : LASER
    if (currCell.type === SKY) updateCell(pos, LASER, laserObject)
    setTimeout(() => {
        if (currCell.type === LASER) updateCell(pos)
    }, gHero.laserSpeed)
}