function cellClicked(ev, i, j) {
  var cell = gBoard[i][j];
  if (gPutMines === true && gNumberOfMinesToPut > 0) {
    gBoard[i][j].isMine = true;
    gBoard[i][j].isShown = true;
    gNumberOfMinesToPut--;
    printMat(gBoard, '.board-container');
    showDifflcultButtons();
    if(gNumberOfMinesToPut === 0) {
    gPutMines = false;
    setMinesNegsCount(gBoard);
    unShownBoard();
    printMat(gBoard, '.board-container');
    }    
    return;
  } 
  else if (gIntAlreadyClicked !== 0) return; //gInt already clicked
  else if (!gGame.isOn) return // GAME IS OVER GO BACK
  else if (ev.button === 2) cellMarked(i, j); //RIGHT MOUSE
  else {
    if(gInt === 'on' && gIntsLeft > 0) {
      gIntsLeft--;
      showDifflcultButtons(); // render buttons
      gIntAlreadyClicked++;
      intNegs(i, j);
      printMat(gBoard, '.board-container');
      setTimeout(function () {
        gInt = 'off';
        intNegs(i, j);
        printMat(gBoard, '.board-container');
      }, 5000)
    } else {

      if (gTimerClicked === false) { //FIRST CLICK START TIMER
        gTimerInterval = setInterval(timeFunc, 1000);
        changeFace();
        cellClickFirstTime(i, j);
        printMat(gBoard, '.board-container');
        gFirstClick = 1;
        gTimerClicked = true;
        return;
      }

      cell.isShown = true;
      if (cell.isMarked) gBoard[i][j].isMarked = false;

      if (cell.isMine) { // CLICKED ON MINE !
        gGame.lifeCount--;
        cell.color = 'red';
        printMat(gBoard, '.board-container');
        if (gGame.lifeCount === 0) {
          gGame.loseOrWin = 'dead';
          printMat(gBoard, '.board-container');
          gameOver();
        }
      } else { // CLICKED ON EMPTY
        //---------------------------------------change face-----------//
        changeFace();
        gGame.shownCount++;
        cell.color = 'lightgrey'

        if (cell.minesAroundCount === 0) {
          cell.type = '';
          showAroundTheCell(i, j) //SHOW AROUND THE CELL
          updateScore();
          checkGameOver();
        } else {
          cell.type = cell.minesAroundCount;
          cell.innerTextColor = colorOfTheText(gBoard[i][j]);
          updateScore();
          checkGameOver();
        }
        printMat(gBoard, '.board-container');
      }
    }
  }
}

// ----------------------- CLICKED FIRST TIME ---------------------------------//

function cellClickFirstTime(i, j) {
  var cell = gBoard[i][j];
  cell.isShown = true;
  cell.color = 'lightgrey'
  if (cell.isMine) { //FOR MINES
    cell.isMine = false;
    cell.type = '';
    cell.minesAroundCount = 0;
    gLevel[gCurrLvl - 1].MINE = countBombAroundForNewBomLoc(i, j) + 1; //keep the bomb to one
    setMinesNegsCount(gBoard); //Count Again
    showAroundTheCell(i, j); // now open what we need to ope
    putRandomMines(gBoard);
    updateScore();
  } else { // FOR ZEROS AND OTHER NUMBER
    cell.type = '';
    gLevel[gCurrLvl - 1].MINE = countBombAroundForNewBomLoc(i, j); //  check if we
    setMinesNegsCount(gBoard);
    showAroundTheCell(i, j);
    if (gLevel[gCurrLvl - 1].MINE !== 0) putRandomMines(gBoard);
    updateScore();
  }
}

function countBombAroundForNewBomLoc(indexI, indexJ) {
  var bombCount = 0
  for (var i = indexI - 1; i <= indexI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = indexJ - 1; j <= indexJ + 1; j++) {
      var cell = gBoard[i][j];
      if ((indexI === i && indexJ === j) || j < 0 || j >= gBoard.length) continue;
      if (gBoard[i][j].isMine) {
        cell.isMine = false;
        cell.type = '';
        bombCount++;
      }
    }
  }
  return bombCount;
}

function intNegs(indexI, indexJ) {
  for (var i = indexI - 1; i <= indexI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = indexJ - 1; j <= indexJ + 1; j++) {
      if (j < 0 || j >= gBoard.length) continue;
      if (gInt === 'on' && !gBoard[i][j].isShown && gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true;
        gBoard[i][j].color = 'rgb(175, 171, 171)';
        continue;
      }
      if (gInt === 'off' && gBoard[i][j].isShown && gBoard[i][j].isMine) {
        gBoard[i][j].isShown = false;
        gBoard[i][j].color = 'grey';
        continue;
      }
    }
  }
  gIntAlreadyClicked = 0;
}

function showAroundTheCell(indexI, indexJ) {
  for (var i = indexI - 1; i <= indexI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = indexJ - 1; j <= indexJ + 1; j++) {
      if ((indexI === i && indexJ === j) || j < 0 || j >= gBoard.length ||
        gBoard[i][j].isShown || gBoard[i][j].isMarked || gBoard[i][j].isMine) continue;
      if (gPrevIndex.i === i && gPrevIndex.j === j) continue;

      gBoard[i][j].color = 'lightgray';
      gBoard[i][j].isShown = true;

      if (gBoard[i][j].minesAroundCount === 0) {
        gPrevIndex = {
          i: i,
          j: j
        }
        gGame.shownCount++;
        gBoard[i][j].type = '';
        showAroundTheCell(i, j)
      } else {
        gGame.shownCount++;
        gBoard[i][j].type = gBoard[i][j].minesAroundCount;
        gBoard[i][j].innerTextColor = colorOfTheText(gBoard[i][j])
      }
    }
  }
  return
}

function cellMarked(i, j) {
  if (!gGame.isOn) return; //GAME IS OVER GO BACK!
  if (gBoard[i][j].isMarked) { //ALREADY MARKED!
    gBoard[i][j].isMarked = false;
    gGame.markedCount--;
    printMat(gBoard, '.board-container');
  } else {
    gGame.markedCount++;
    gBoard[i][j].isMarked = true;
    gBoard[i][j].type = FLAG
    printMat(gBoard, '.board-container');
    checkGameOver();
  }
};


function postionsMineMenuelly() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j]
      cell.type = ''
      cell.isMine = false;
    }
  } // EMPTY BOARD
  gNumberOfMinesToPut = gLevel[gCurrLvl - 1].mineForEndGame;
  showDifflcultButtons();
}