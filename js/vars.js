var MINE = '<img src="./img/mine.png" class="mine">';
var CELL = '';
var FLAG = '<img src="./img/flag.png" class="flag">';
var LIFE = '<img src="./img/life.png" class="life">';

var gBoard = [];

var gCurrLvl = 1 //for init only
var gLevel = [{
  DIFF: 'Begginer',
  SIZE: 4,
  MINE: 2,
  LIFES: 1
}, {
  DIFF: 'Medium',
  SIZE: 8,
  MINE: 12,
  LIFES: 2
}, {
  DIFF: 'Expert',
  SIZE: 12,
  MINE: 30,
  LIFES: 3
}];

var gGame = {
  isOn: true,
  state: '',
  score: 0,
  shownCount: 0,
  markedCount: 0,
  lifeCount: gLevel[gCurrLvl - 1].LIFES
};

var gPrevIndex = { //for recurtion
  i: Infinity,
  j: Infinity
};

var gFaceCollapse = 2; //for init only
var gScoreCollapse = 1; //for init only
var gTimerCollapse = 1; //for init only

var gPutMines = false;
var gMenualGameMode = false;
var gNumberOfMinesToPut = 0;

var gInt = 'off';
var gOnInt = false;
var gIntsLeft = 3;
var gIntsCellToClose = [];

var gTimerInterval;
var gTimerClicked = false;
var gTimeStr = '000';

var gAllTurns = [];
var gNewTurnGameData = [];

var gSafeClicks = 3;

// --------------------------------------RESET-----------------------------------//


function resetGame() {
  gSafeClicks = 3;

  gAllTurns = [];
  gNewTurnGameData = [];

  gPrevIndex = {
    i: Infinity,
    j: Infinity
  };

  gGame = {
    isOn: true,
    state: '',
    score: 0,
    shownCount: 0,
    markedCount: 0,
    lifeCount: gLevel[gCurrLvl - 1].LIFES
  };

  gTimeStr = '000';
  gTimerClicked = false;
  gFirstClick = 0;

  gInt = 'off';
  gOnInt = false;
  gIntsLeft = 3;
  gIntsCellToClose = [];

  gPutMines = false;
  gNumberOfMinesToPut = 0;
  gMenualGameMode = false;
  clearInterval(gTimerInterval);
  init();
}