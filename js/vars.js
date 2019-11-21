var MINE = '<img src="./img/mine.png" class="mine">'
var CELL = ''
var FLAG = '<img src="./img/flag.png" class="flag">'
var LIFE = '<img src="./img/life.png" class="life">'

var gAllTurns = [];
var gNewTurn = [];
var gIsUndo = false;

var gPutMines = false;
var gNumberOfMinesToPut = 0;

var gBoard = [];

var gInt = 'off';
var gIntAlreadyClicked = 0;
var gIntsLeft = 3

var gLevel = [{
  DIFF: 'Begginer',
  SIZE: 4,
  MINE: 2,
  mineForEndGame: 2,
  LIFES: 1
}, {
  DIFF: 'Medium',
  SIZE: 8,
  MINE: 12,
  mineForEndGame: 12,
  LIFES: 2
}, {
  DIFF: 'Expert',
  SIZE: 12,
  MINE: 30,
  mineForEndGame: 30,
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






function resetGame() {

  gBoard = [];

  gAllTurns = [];
  gNewTurn = [];
  gIsUndo = false;

  gPrevIndex = {
    i: Infinity,
    j: Infinity
  };

  gGame = {
    isOn: true,
    loseOrWin: '',
    score: 0,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lifeCount: gLevel[gCurrLvl - 1].LIFES
  };

  gLevel = [{
    DIFF: 'Begginer',
    SIZE: 4,
    MINE: 2,
    mineForEndGame: 2,
    LIFES: 1
  }, {
    DIFF: 'Medium',
    SIZE: 8,
    MINE: 12,
    mineForEndGame: 12,
    LIFES: 2
  }, {
    DIFF: 'Expert',
    SIZE: 12,
    MINE: 30,
    mineForEndGame: 30,
    LIFES: 3
  }];

  gTimeStr = '000';
  gTimerClicked = false;
  gFirstClick = 0;

  gInt = 'off';
  gIntAlreadyClicked = 0;
  gIntsLeft = 3

  gPutMines = false;
  gNumberOfMinesToPut = 0;

  clearInterval(gTimerInterval);
  init();
}