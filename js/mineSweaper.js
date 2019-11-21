var MINE = '<img src="./img/mine.png" class="mine">'
var CELL = ''
var FLAG = '<img src="./img/flag.png" class="flag">'
var LIFE = '<img src="./img/life.png" class="life">'
var gBoard = [];
var gLevel = [{
  SIZE: 4,
  MINE: 2,
  LIFES: 1
}, {
  SIZE: 8,
  MINE: 12,
  LIFES: 2
}, {
  SIZE: 12,
  MINE: 30,
  LIFES: 3
}];
var gCurrLvl = 1

var gPrevIndex = {
  i: Infinity,
  j: Infinity
};

var gGame = {
  isOn: true,
  loseOrWin: '',
  score: 0,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lifeCount: gLevel[gCurrLvl - 1].LIFES
};

var gTimerInterval;
var gTimerClicked = false;
var gTimeStr = '000'


// -------------------------------------------------------------------------//

function init() {
  document.addEventListener('contextmenu', event => event.preventDefault()); // diasble right click
  gBoard = buildBoard();
  printMat(gBoard, '.board-container');
  showDifflcultButtons();
}

function buildBoard() {
  console.log('build board');
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
  console.table(board)
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
  for (var numberOfMines = 0; numberOfMines < gLevel[gCurrLvl - 1].MINE; numberOfMines++) {
    var index = (options.splice(Math.floor(Math.random() * options.length), 1)[0]);
    board[index.i][index.j].type = MINE;
    board[index.i][index.j].isMine = true;
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

//-----------------------CELL CLICKED -----------------------------------------//

function cellClicked(ev, i, j) {
  var cell = gBoard[i][j];

  if (!gGame.isOn) return // GAME IS OVER GO BACK
  if (ev.button === 2) cellMarked(i, j); //RIGHT MOUSE
  else {


    if (gTimerClicked === false) { //FIRST CLICK START TIMER
      gTimerInterval = setInterval(timeFunc, 1000);
      changeFace();
      // cellClickFirstTime(cell);
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
  };
};

// ----------------------- CLICKED FIRST TIME ---------------------------------//

function cellClickFirstTime(cell) {



}






// ------------------ CHECK THE COLOR OF THE NEARBYMINES COUNTER----------------//

function colorOfTheText(cell) {
  debugger;
  console.log(cell);
  switch (cell.type) {
    case 1:
      cell.innerTextColor = 'blue';
      break;
    case 2:
      cell.innerTextColor = 'green';
      break;
    case 3:
      cell.innerTextColor = 'red';
      break;
    case 4:
      cell.innerTextColor = 'hsl(266, 69%, 18%)'
      break;
    case 5:
      cell.innerTextColor = 'brown'
      break;
    case 6:
      cell.innerTextColor = 'rgb(108, 162, 184);'
      break;
    case 7:
      cell.innerTextColor = 'black'
      break;
    case 8:
      cell.innerTextColor = 'rgb(95, 90, 90)'
      break;
    default:
      break;
  }
  return cell.innerTextColor;
}

function showAroundTheCell(indexI, indexJ) {
  for (var i = indexI - 1; i <= indexI + 1; i++) {
    if (i < 0) continue;
    for (var j = indexJ - 1; j <= indexJ + 1; j++) {
      if ((indexI === i && indexJ === j) || j < 0 ||
        i >= gBoard.length || j >= gBoard.length ||
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
        // debugger;
        gGame.shownCount++;
        gBoard[i][j].type = gBoard[i][j].minesAroundCount;
        gBoard[i][j].innerTextColor = colorOfTheText(gBoard[i][j])
      }
    }
  }
  debugger
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

function timeFunc() {
  gTimerClicked = true;
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
  gGame.score = gGame.shownCount;
  document.querySelector('.scoreValue').innerText = gGame.score;
}

function checkGameOver() {
  if (gGame.shownCount + gGame.markedCount === gBoard.length * gBoard.length) {
    gGame.loseOrWin = 'win';
    gameOver();
  }
};

function gameOver() {
  gGame.isOn = false;
  clearInterval(gTimerInterval);
}

function resetGame() {
  gBoard = [];

  gGame = {
    isOn: true,
    loseOrWin: '',
    score: 0,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lifeCount: gLevel[gCurrLvl - 1].LIFES
  };

  gTimeStr = '000';
  gTimerClicked = false;

  clearInterval(gTimerInterval);
  init();
}