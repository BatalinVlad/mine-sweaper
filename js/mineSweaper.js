function init() {
  document.addEventListener('contextmenu', event => event.preventDefault()); // diasble right click
  gBoard = buildBoard();
  printBoard(gBoard, '.board-container');
  showDifflcultButtons();
}

function buildBoard() { //CREATE AND EMPTY BOARD;
  var board = [];
  for (var i = 0; i < gLevel[gCurrLvl - 1].SIZE; i++) {
    board[i] = [];
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
  return board;
}

function putRandomMinesAroundCell(indexI, indexJ) {
  var options = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      // MAKE SURE THAT WE GOT A SAFE LOCATION TO PUT OUR MINES //
      if (Math.abs(indexI - i) >= 2 || Math.abs(indexJ - j) >= 2) {
        var option = {
          i: i,
          j: j
        };
        options.push(option);
      }
    }
  }

  //PUT TO THE RANDOM POSITION THAT WE GET EARLIER ---------------- //

  for (var numberOfMines = 0; numberOfMines < gLevel[gCurrLvl - 1].MINE; numberOfMines++) {
    var index = (options.splice(Math.floor(Math.random() * options.length), 1)[0]);
    gBoard[index.i][index.j].type = MINE;
    gBoard[index.i][index.j].isMine = true;
  }
}

function setMinesNegsCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      cell.minesAroundCount = countNegs(i, j); // COUNT THE MINES AROUD CELL
    }
  }
}

function countNegs(indexI, indexJ) {
  var minesCount = 0;
  for (var i = indexI - 1; i <= indexI + 1; i++) {
    if (i < 0) continue;
    for (var j = indexJ - 1; j <= indexJ + 1; j++) {
      if (j < 0 || i === gBoard.length || j === gBoard.length) continue;
      var cell = gBoard[i][j];
      if (cell.isMine) minesCount++;
    }
  }
  return minesCount;
};

// --------------- TIMER FUNCTION ---------------------------------------------------//

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

function intButtonClicked() {
  if (gInt === 'off')
    gInt = 'on';
}

function postionsMineMenuellyButtonClicked() {
  gPutMines = true;
  gMenualGameMode = true;
  gBoard = buildBoard();
  gNumberOfMinesToPut = gLevel[gCurrLvl - 1].MINE;
  showDifflcultButtons();
}

function undoButtonClicked() {
  if(!gGame.isOn) return;
  if (!gAllTurns.length) return;
  if (gAllTurns.length === 1)  {  // AFTER FIRST TURND UNDO
    unShownBoard();
    gGame.score = 0;
    gGame.shownCount = 0;
    gGame.isMarked = 0;
    gNewTurnGameData.pop();
    gAllTurns.pop();
    printBoard(gBoard,'.board-container');
    return; 
  } else { // Second turn etc ...
    gAllTurns.pop(); // get rid of the curr turn 
    gNewTurnGameData.pop();
    gGame = gNewTurnGameData[gNewTurnGameData.length - 1];
    var turnBack = gAllTurns[gAllTurns.length - 1]; // pop the second turn 
    gBoard = turnBack.splice(0,turnBack.length); 
    updateScore();
    printBoard(gBoard,'.board-container');
    return;
  }
}

function safeButtonClicked() {
  if(!gSafeClicks) return;
  showRandomSafeCell();
  gSafeClicks--;
  showDifflcultButtons();
  return;
}

//----------------- SCORE SECTION AND GAME OVER FUNC----------------------------------------//

function updateScore() {
  if (!gTimerClicked) gGame.shownCount++;
  gGame.score = gGame.shownCount;
  document.querySelector('.scoreValue').innerText = gGame.score;
}

function checkGameOver() {
  if ((gGame.score + gGame.markedCount === gBoard.length * gBoard.length) &&
    (gGame.markedCount === gLevel[gCurrLvl - 1].MINE)) {
    gGame.state = 'win';
    gameOver();
  }
};

function gameOver() {
  gGame.isOn = false;
  clearInterval(gTimerInterval);
  // LOCAL STORAGE  --- > SAVE BEST SCORE //
  if (gGame.state === 'win') {
    var userName = prompt('enter UserName:');
    var difficult = gLevel[gCurrLvl - 1].DIFF; //lets save best score by difficult
    gTimeStr = parseInt(gTimeStr);
    gTimeStr = Math.floor(gTimeStr / 60) + ' min ' + gTimeStr % 60 + ' sec';
    var bestScore = localStorage.getItem('Best Score at: ' + difficult);
    if (!bestScore) { // IF THERE IS NO SCORE YET
      localStorage.setItem('Best Score at: ' + difficult, gTimeStr); //SET SCORE
      localStorage.setItem('UserName', userName); //SET USER NAME
    } else if (bestScore.localeCompare(gTimeStr) === 1) { //COMPARE BOTH SCORES
      localStorage.removeItem('UserName'); //REMOVE OLDER SCORE AND USERNAME
      localStorage.removeItem('Best Score at: ' + difficult);
      localStorage.setItem('Best Score at: ' + difficult, gTimeStr); //PUT NEW SCORE AND USERNAME
      localStorage.setItem('UserName', userName);
    }
  }
}