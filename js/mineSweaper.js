var MINE = '<img src="./img/mine.png" class="mine">'
var CELL = ''
var FLAG = '<img src="./img/flag.png" class="flag">'

var gBoard = [];

var gLevel = {
  SIZE: 4,
  MINES: 2
};

var gGame = {
  isOn: true,
  loseOrWin: '',
  score: 0,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0
};

var gCellWithoutMines = 0;
var gTimerInterval;
var gTimerCounter = 0;
var gTimerClicked = false;


// -------------------------------------------------------------------------//

function init() {
  document.addEventListener('contextmenu', event => event.preventDefault()); // diasble right click
  gBoard = buildBoard();
  printMat(gBoard, '.board-container');
}




function buildBoard() {
  console.log('build board');
  var board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        isNearCell: false,
        type: '',
        color: 'grey'
      };
      board[i][j] = cell;
      gCellWithoutMines++;
    }
  }
  putRandomMines(board);
  setMinesNegsCount(board);
  return board;
}


function putRandomMines(board) {
  console.log('PUT SOME MINES')
  var options = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var option = {
        i: i,
        j: j
      };
      options.push(option);
    }
  }
  for (var numberOfMines = 0; numberOfMines < gLevel.MINES; numberOfMines++) {
    var index = (options.splice(Math.floor(Math.random() * options.length), 1)[0]);
    board[index.i][index.j].type = MINE;
    board[index.i][index.j].isMine = true;
    gCellWithoutMines--;
  }
}


function setMinesNegsCount(board) {
  console.log('lets check negs');
  var boardWithNegs = [];
  for (var i = 0; i < board.length; i++) {
    boardWithNegs[i] = [];
    for (var j = 0; j < board[0].length; j++) {
      board[i][j].minesAroundCount = countNegs(board, i, j);
    }
  }
}


function countNegs(board, indexI, indexJ) {
  var minesCount = 0;
  for (var i = indexI - 1; i <= indexI + 1; i++) {
    if (i < 0) continue;
    for (var j = indexJ - 1; j <= indexJ + 1; j++) {
      if (j < 0 || i === board.length || j === board.length) continue;
      if (board[i][j].isMine) minesCount++;
    }
  }
  return minesCount;
};



function cellClicked(ev, i, j) {
  if (ev.button === 2) cellMarked(i, j);
  else {

    if (gTimerClicked === false) {
      gTimerInterval = setInterval(timeFunc, 1000);
    }

    var cell = gBoard[i][j];
    cell.isShown = true;
    if (cell.isMarked) gBoard[i][j].isMarked = false;


    if (cell.isMine) {
      cell.color = 'red';
      gGame.loseOrWin = 'lose';
      printMat(gBoard, '.board-container');
      gameOver();

    } else {
      updateScore(1);
      checkGameOver();
      cell.color = 'lightgrey';
      cell.type = '';
      cell.isNearCell = true;
      gGame.shownCount++;
      showAroundTheCell(i, j)
      printMat(gBoard, '.board-container');
    }
  };
};



function showAroundTheCell(indexI, indexJ) {
  for (var i = indexI - 1; i <= indexI + 1; i++) {
    if (i < 0) continue;
    for (var j = indexJ - 1; j <= indexJ + 1; j++) {
      if ((indexI === i && indexJ === j) || j < 0 ||
        i >= gBoard.length || j >= gBoard.length ||
        gBoard[i][j].isShown || gBoard[i][j].isMarked) continue;
      gBoard[i][j].type = gBoard[i][j].minesAroundCount;
      gBoard[i][j].isNearCell = true;
    }
  }
}

function cellMarked(i, j) {
  if (gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false;
    printMat(gBoard, '.board-container');
  } else {
    gBoard[i][j].isMarked = true;
    gBoard[i][j].type = FLAG
    gGame.markedCount++;
    printMat(gBoard, '.board-container');
    checkGameOver();
  }
};



function timeFunc() {
  gTimerClicked = true;
  gTimerCounter++;
  printTime();
}


function updateScore(value) {
  gGame.score += value;
  document.querySelector('.scoreValue').innerText = gGame.score;
}


function checkGameOver() {
  var flagsCounter = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      if (cell.isMarked) flagsCounter++;
    }
  }
  if (flagsCounter === gLevel.MINES &&
    gGame.score === i * j - gLevel.MINES) {
    gGame.loseOrWin = 'win';
    gameOver();
  }
};


function gameOver() {
  console.log('GameOver')
  gGame.isOn = false;
  clearInterval(gTimerInterval);
}


function resetGame() {
  console.log('RESET GAME')
  gBoard = [];

  gLevel = {
    SIZE: 4,
    MINES: 2
  };

  gGame = {
    isOn: true,
    loseOrWin: '',
    score: 0,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
  };

  clearInterval(gTimerInterval);
  init();
}