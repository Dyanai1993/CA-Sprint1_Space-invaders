'use strict';

var gHero;

// creates the hero and place it on board
function createHero(board) {
  board[gHero.pos.i][gHero.pos.j] = createCell(HERO, HERO);
}

function onKeyDown(ev) {
  if (!gGame.isOn) return;
  switch (ev.key) {
    case 'ArrowLeft':
      if (gHero.pos.j > 0) {
        moveHero('left');
      }
      break;
    case 'ArrowRight':
      if (gHero.pos.j < BOARD_SIZE - 1) {
        moveHero('right');
      }
      break;
    case 'x':
      if (gHero.superOn || gHero.superAttackCount === 0) return;
      gHero.superOn = true;
      gHero.superAttackCount--;
      updateFastLasers();
      gHero.laserSpeed = 40;
      if (gHero.isLaser) {
        clearInterval(gHero.laserInterval);
        setShootInterval(gHero.laserPos);
      }
      break;
    case 'n':
      var aliensToKill = getLaserAlienNegsPos(gHero.laserPos);
      killLaserAlienNegs(aliensToKill);
      console.log(aliensToKill);

      break;
    case ' ':
      if (!gHero.isShoot) {
        gHero.isShoot = true;
        handleShoot();
      }
      break;
  }
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
  updateCell(gHero.pos);
  if (dir === 'right') gHero.pos.j++;
  else if (dir === 'left') gHero.pos.j--;
  if (gBoard[gHero.pos.i][gHero.pos.j].type === ROCK) {
    removeLife();
    gAlien.isThrowingRock = false;
  }
  updateCell(gHero.pos, HERO, HERO);
}

function getLaserAlienNegsPos(pos) {
  var laserAlienNegsPos = [];
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      var currCell = gBoard[i][j];
      var currPos = { i, j };
      if (
        currCell.gameObject === ALIEN1 ||
        currCell.gameObject === ALIEN2 ||
        currCell.gameObject === ALIEN3
      ) {
        laserAlienNegsPos.push(currPos);
      }
    }
  }
  return laserAlienNegsPos;
}

function killLaserAlienNegs(alienNegs) {
  for (var i = 0; i < alienNegs.length; i++) {
    killAlien(alienNegs[i]);
  }
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function handleShoot(pos) {
  var pos = { i: gHero.pos.i - 1, j: gHero.pos.j };
  playSound('shoot');
  if (gBoard[pos.i][pos.j].type === ROCK) removeRock(pos);
  gHero.laserPos = pos;
  gHero.isLaser = true;
  blinkLaser(pos);
  checkHit(pos);
  setShootInterval(pos);
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
  var currCell = gBoard[pos.i][pos.j];
  var laserObject = gHero.superOn ? FAST_LASER : LASER;
  if (currCell.type === SKY) updateCell(pos, LASER, laserObject);
  setTimeout(() => {
    if (currCell.type === LASER) updateCell(pos);
  }, gHero.laserSpeed);
}

function checkHit(pos) {
  var currCell = gBoard[pos.i][pos.j];
  if (currCell.type === ALIEN) {
    killAlien(pos);
    removeLaser();
  } else if (currCell.type === CANDY) {
    removeLaser();
    collectCandy(pos);
  } else if (currCell.type === ROCK) {
    removeRock(pos);
    removeLaser();
  } else if (currCell.type === BUNKER) {
    removeBunker(pos);
    removeLaser();
  } else {
    blinkLaser(pos);
  }
}

function setShootInterval(pos) {
  gHero.laserInterval = setInterval(() => {
    pos = { i: pos.i - 1, j: pos.j };
    gHero.laserPos = pos;
    if (pos.i < 0) {
      removeLaser();
    } else {
      checkHit(pos);
    }
  }, gHero.laserSpeed);
}

function removeLaser() {
  gHero.isShoot = false;
  if (gHero.superOn) removeSuper();
  clearInterval(gHero.laserInterval);
  gHero.isLaser = false;
}

function removeSuper() {
  gHero.superOn = false;
  gHero.laserSpeed = 80;
}

function removeLife() {
  gHero.lives--;
  updateLives();
  playSound('life_lost');
  if (gHero.lives === 0) gameFinish(false);
}
