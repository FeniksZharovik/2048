const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
let tiles = [];
let score = 0;

function setupBoard() {
  board.innerHTML = '';
  tiles = [];
  for (let i = 0; i < 16; i++) {
    let tile = document.createElement('div');
    tile.classList.add('tile');
    tile.textContent = '';
    tile.dataset.value = '';
    tiles.push(tile);
    board.appendChild(tile);
  }
  score = 0;
  updateScore();
  addNewTile();
  addNewTile();
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function addNewTile() {
  let emptyTiles = tiles.filter(t => t.textContent === '');
  if (emptyTiles.length === 0) return;
  let rand = Math.floor(Math.random() * emptyTiles.length);
  let value = Math.random() < 0.9 ? 2 : 4;
  emptyTiles[rand].textContent = value;
  emptyTiles[rand].dataset.value = value;
}

function getTile(x, y) {
  return tiles[y * 4 + x];
}

function slide(row) {
  let newRow = row.filter(n => n !== '');
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow[i + 1] = '';
    }
  }
  return newRow.filter(n => n !== '').concat(Array(4 - newRow.filter(n => n !== '').length).fill(''));
}

function move(direction) {
  let moved = false;
  for (let y = 0; y < 4; y++) {
    let row = [];
    for (let x = 0; x < 4; x++) {
      let tile = getTile(x, y);
      row.push(direction === 'left' || direction === 'right' ? tile.textContent : getTile(y, x).textContent);
    }

    if (direction === 'right' || direction === 'down') row.reverse();

    let newRow = slide(row);

    if (direction === 'right' || direction === 'down') newRow.reverse();

    for (let x = 0; x < 4; x++) {
      let idx = direction === 'left' || direction === 'right' ? y * 4 + x : x * 4 + y;
      let old = tiles[idx].textContent;
      if (tiles[idx].textContent !== newRow[x]) moved = true;
      tiles[idx].textContent = newRow[x] === '' ? '' : newRow[x];
      tiles[idx].dataset.value = newRow[x] === '' ? '' : newRow[x];
    }
  }

  if (moved) {
    addNewTile();
    updateScore();
  }
}

function restartGame() {
  setupBoard();
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowLeft': move('left'); break;
    case 'ArrowRight': move('right'); break;
    case 'ArrowUp': move('up'); break;
    case 'ArrowDown': move('down'); break;
  }
});

// Swipe support untuk HP
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
document.addEventListener('touchend', e => {
  let dx = e.changedTouches[0].clientX - touchStartX;
  let dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move('right');
    else if (dx < -30) move('left');
  } else {
    if (dy > 30) move('down');
    else if (dy < -30) move('up');
  }
});

window.onload = setupBoard;
