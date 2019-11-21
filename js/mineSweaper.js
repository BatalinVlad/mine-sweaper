function init() {
  document.addEventListener('contextmenu', event => event.preventDefault()); // diasble right click
  gBoard = buildBoard();
  gNewTurn = gBoard.slice();
  gAllTurns.push(gNewTurn); //FIRST TURN
  printMat(gBoard, '.board-container');
  showDifflcultButtons();
}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel[gCurrLvl - 1].SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel[gCurrLvl - 1].SIZE; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        type: '',
        innerTextColor: '',
        color: 'grey'
      };
      board[i][j] = cell;
    }
  }
  putRandomMines(board);
  setMinesNegsCount(board);
  return board;
}

function putRandomMines(board) {
  
  var options = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];
      if (cell.isMine || cell.isShown) continue; // for first time To keep it Safe!
      var option = {
        i: i,
        j: j
      };
      options.push(option);
    }
  }
  if (options.length > 0) {
    for (var numberOfMines = 0; numberOfMines < gLevel[gCurrLvl - 1].MINE; numberOfMines++) {
      var index = (options.splice(Math.floor(Math.random() * options.length), 1)[0]);
      board[index.i][index.j].type = MINE;
      board[index.i][index.j].isMine = true;
    }
  }
}

function setMinesNegsCount(board) {
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

function timeFunc() {
  gTimeStr = parseInt(gTimeStr) + 1;
  if (gTimeStr < 10) {
    gTimeStr = '00' + gTimeStr;
    printTime();
  } else if (gTimeStr < 100) {
    gTimeStr = '0' + gTimeStr;
    printTime();
  } else printTime();
}

//--------------------------BUTTONS SECTION-------------------------------------------//

function diffButtonClicked(elButton) {
  var diffData = elButton.getAttribute('data-id');
  if (diffData === '1') {
    gCurrLvl = 1;
    gFaceCollapse = 2;
    gScoreCollapse = 1;
    gTimerCollapse = 1;
    resetGame();
  } else if (diffData === '2') {
    gCurrLvl = 2;
    gFaceCollapse = 4;
    gScoreCollapse = 2;
    gTimerCollapse = 2;
    resetGame();
  } else {
    gCurrLvl = 3;
    gFaceCollapse = 6;
    gScoreCollapse = 3;
    gTimerCollapse = 3;
    resetGame();
  }
}

//------------------------------------------------------------------------------------//

function updateScore() {
  if (gTimerClicked === false) gGame.shownCount++;
  gGame.score = gGame.shownCount;
  document.querySelector('.scoreValue').innerText = gGame.score;
}

function checkGameOver() {
  if ((gGame.score + gGame.markedCount === gBoard.length * gBoard.length) &&
    (gGame.markedCount === gLevel[gCurrLvl - 1].mineForEndGame)) {
    gGame.loseOrWin = 'win';
    gameOver();
  }
};

function intButtonClicked(){
  if(gInt === 'off')
  gInt = 'on'
}

function gameOver() {
  gGame.isOn = false;
  clearInterval(gTimerInterval);
  gTimeStr = parseInt(gTimeStr); 
  if(document.getElementById("result").innerHTML = localStorage.getItem(gLevel[gCurrLvl -1].DIFF) === null)
  {
    localStorage.setItem(gLevel[gCurrLvl -1].DIFF, gTimeStr);
  }
  else (bestScore < gTimeStr)? 
  localStorage.setItem(gLevel[gCurrLvl -1].DIFF, gTimeStr) :
  localStorage.setItem(gLevel[gCurrLvl -1].DIFF, gTimeStr);
}


