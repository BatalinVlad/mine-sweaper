// -------------------- ONLY FOR CELL FUNCS -----------------------------------//

function cellClicked(ev, i, j) {
  if (!gGame.isOn) return; // GAME IS OVER GO BACK
  if (gOnInt) return;
  if (ev.button === 2) {
    cellMarked(i, j); //RIGHT MOUSE
    return;
  }
  var cell = gBoard[i][j];
  var newTurn = gBoard.slice(0, gBoard.length);

  if (gPutMines && gNumberOfMinesToPut > 0) { // PUT MINES MENUALLY
    cell.type = MINE;
    cell.isMine = true;
    cell.isShown = true;
    gNumberOfMinesToPut--;
    printBoard(gBoard, '.board-container');
    showDifflcultButtons();
    if (gNumberOfMinesToPut === 0) {
      gPutMines = false;
      setMinesNegsCount();
      //ill give you a sec to watch the mines and close the board !
      setTimeout(function () {
        unShownBoard();
        printBoard(gBoard, '.board-container');
      }, 1000);
    }
    return;
  }


  if (gTimerClicked === false) { //FIRST CLICK START TIMER
    if (gMenualGameMode) {
      gTimerInterval = setInterval(timeFunc, 1000);
      gTimerClicked = true;
      return;
    }
    gTimerInterval = setInterval(timeFunc, 1000);
    changeFace();
    cellClickedFirstTime(i, j);
    gTimerClicked = true;
    return;
  }

  // -------------------- NOT FIRST TIME ---------------------------------------//

  if (gInt === 'on' && gIntsLeft > 0) { //INTING WAIT !
    intClicked(i, j);
    return;
  }

  cell.isShown = true; //SHOW THE CELL
  if (cell.isMarked) {
    gBoard[i][j].isMarked = false; //IF MARKED - > UNMARK
    gAllTurns.push(newTurn);
  }

  if (cell.isMine) { // CLICKED ON MINE !
    gGame.lifeCount--;
    cell.color = 'red';
    printBoard(gBoard, '.board-container');
    if (gGame.lifeCount === 0) {
      gGame.state = 'dead';
      printBoard(gBoard, '.board-container');
      saveNewTurn();
      gameOver();
    }
  } else { // CLICKED ON EMPTY
    changeFace();
    gGame.shownCount++;
    cell.color = 'lightgrey';
    if (cell.minesAroundCount === 0) {
      cell.type = '';
      showAroundTheCell(i, j) //SHOW AROUND THE CELL
      saveNewTurn();
      updateScore();
      checkGameOver();
    } else {
      cell.type = cell.minesAroundCount;
      cell.innerTextColor = colorOfTheText(gBoard[i][j]);
      saveNewTurn();
      updateScore();
      checkGameOver();
    }
    printBoard(gBoard, '.board-container');
  }
}

// ----------------------- CLICKED FIRST TIME FUNC AND ALGO ---------------------------------//
//------THERE IS NO MINES YET  ----- EMPTY BOARD----------------------------------//

function cellClickedFirstTime(i, j) {
  var cell = gBoard[i][j];
  if (cell.isMarked) cell.isMarked = false; //IF WE FIRST MARKED AND THEN OPENED 
  cell.type = '';
  cell.isShown = true; //open and color the cell
  cell.color = 'lightgrey';
  putRandomMinesAroundCell(i, j); // we placed our mines 
  setMinesNegsCount(); // count negs
  if (gInt === 'on') { //WHY YOU WANT TO INT IN THE FIRST TIME GODDD...
    cell.isShown = false;
    cell.color = 'rgb(175, 171, 171)';
    intClicked(i, j);
    return;
  }
  showAroundTheCell(i, j); // ope with RECURTION
  saveNewTurn();
  printBoard(gBoard, '.board-container');
  updateScore();
}

// -----------------------------INT FUNCS-----------------------------------------//

function intClicked(i, j) {
  gOnInt = true;
  gIntsLeft--;
  showDifflcultButtons(); // render buttons
  intNegs(i, j);
  printBoard(gBoard, '.board-container');
  setTimeout(function () {
    gInt = 'off';
    intNegs(i, j);
    printBoard(gBoard, '.board-container');
  }, 2000)
}

function intNegs(indexI, indexJ) {
  if (gInt === 'off') {
    gOnInt = false; // for not be able to click while we on int !
    for (var i = 0; i < gIntsCellToClose.length; i++) {
      var toCloseIndex = gIntsCellToClose[i];
      var cellToClose = gBoard[toCloseIndex.i][toCloseIndex.j];
      cellToClose.isShown = false;
      cellToClose.color = 'grey';
      if (!cellToClose.isMine) cellToClose.type = '';
    }
    return;
  }

  for (var i = indexI - 1; i <= indexI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = indexJ - 1; j <= indexJ + 1; j++) {
      if (j < 0 || j >= gBoard.length) continue;
      var cell = gBoard[i][j];
      var toCloseNextTime = {
        i: i,
        j: j
      }
      if (gInt === 'on' && !cell.isShown) { // OPEN WHAT WE DONT SEE
        cell.isShown = true;
        gIntsCellToClose.push(toCloseNextTime); // push the cells we want to close after
        if (cell.minesAroundCount > 0 && !cell.isMine) {
          cell.type = cell.minesAroundCount;
          cell.color = 'rgb(175, 171, 171)';
          cell.innerTextColor = colorOfTheText(cell);
        } else cell.color = 'rgb(175, 171, 171)';
      }
    }
  }
}

// --------------------------- NEW TURN FOR UNDO -------------------------------------//

function saveNewTurn() {
  var newTurn = [];
  for (var i = 0; i < gBoard.length; i++) {
    newTurn[i] = [];
    for (var j = 0; j < gBoard[0].length; j++) {
      var currCell = gBoard[i][j];
      var newTurnObj = {
        minesAroundCount: currCell.minesAroundCount,
        isShown: currCell.isShown,
        isMine: currCell.isMine,
        isMarked: currCell.isMarked,
        type: currCell.type,
        innerTextColor: currCell.innerTextColor,
        color: currCell.color
      };
      newTurn[i][j] = newTurnObj;
    }
  }
  var currGameData = gGame;
  var gameData = {
    isOn: true,
    state: currGameData.state,
    score: currGameData.score,
    shownCount: currGameData.shownCount,
    markedCount: currGameData.markedCount,
    lifeCount: currGameData.lifeCount
  }
  gNewTurnGameData.push(gameData);
  gAllTurns.push(newTurn);
}

// -------------------------- SAFE CLICK --------------------------------------------//

function showRandomSafeCell() {
  var options = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      if (!cell.isMine && !cell.isShown) {
        var option = {
          i: i,
          j: j
        };
        options.push(option);
      }
    }
  }
var randomSafeClickIndex = (options.splice(Math.floor(Math.random() * options.length), 1)[0]);
if(!randomSafeClickIndex) return;
gBoard[randomSafeClickIndex.i][randomSafeClickIndex.j].color = 'red';
printBoard(gBoard,'.board-container');
}

// -------------RECURTIONS TO EMPTY BEARYBYNEGS THAT GOT ZERO ----------------------- //

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
        };
        gGame.shownCount++;
        gBoard[i][j].type = '';
        showAroundTheCell(i, j);
      } else {
        gGame.shownCount++;
        gBoard[i][j].type = gBoard[i][j].minesAroundCount;
        gBoard[i][j].innerTextColor = colorOfTheText(gBoard[i][j]);
      }
    }
  }
  return;
}

// --------------------- RIGHT CLICK -->  MARK CELL ------------------------------------//

function cellMarked(i, j) {
  var cell = gBoard[i][j];
  if (!gGame.isOn) return; //GAME IS OVER GO BACK!
  if (cell.isMarked) { //ALREADY MARKED!
    cell.isMarked = false;
    gGame.markedCount--;
    saveNewTurn();
    printBoard(gBoard, '.board-container');
  } else {
    gGame.markedCount++;
    cell.isMarked = true;
    cell.type = FLAG;
    saveNewTurn();
    printBoard(gBoard, '.board-container');
    checkGameOver();
  }
};