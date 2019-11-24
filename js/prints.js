function printTime() {
  var elLocationForTime = document.querySelector('.timer');
  elLocationForTime.innerHTML = gTimeStr;
}

function changeFace() {
  gGame.state = 'clickedOnEmpty';
  printBoard(gBoard, '.board-container');
  setTimeout(function () {
    gGame.state = '';
    printBoard(gBoard, '.board-container');
  }, 200)
}

//---------------------------PRINT MAT -------------------------------------------------------------------//

function printBoard(mat, selector) {
  var strHTML = '<div class="life-container"><span>LIVES:</span>';
  for (var i = 0; i < gGame.lifeCount; i++) {
    strHTML += LIFE;
  }
  strHTML += '</div>';
  strHTML += '<table border="10"><tbody>';

  //-------------------------------------------------------header with pics---------------------------//

  if (gGame.state === '' || gGame.state === 'win') {
    strHTML += `<tr><td class="timer" colspan="${gTimerCollapse}">${gTimeStr}</td>`;
    strHTML += `<td class="faceCell" colspan="${gFaceCollapse}" onClick="resetGame()"><img src="./img/normal.png" class="face"></td>`;
    strHTML += `<td class="scoreValue" colspan="${gScoreCollapse}">${gGame.score}</td></tr>`;
  } else if (gGame.state === 'clickedOnEmpty') {
    strHTML += `<tr><td class="timer" colspan="${gTimerCollapse}">${gTimeStr}</td>`;
    strHTML += `<td class="faceCell" colspan="${gFaceCollapse}" onClick="resetGame()">'<img src="./img/clickedOn.png" class="face"></td>`;
    strHTML += `<td class="scoreValue" colspan="${gScoreCollapse}">${gGame.score}</td></tr>`
  } else {
    strHTML += `<tr><td class="timer" colspan="${gTimerCollapse}">${gTimeStr}</td>`;
    strHTML += `<td class="faceCell" colspan="${gFaceCollapse}" onClick="resetGame()"><img src="./img/dead.png" class="face"></td>`;
    strHTML += `<td class="scoreValue" colspan="${gScoreCollapse}">${gGame.score}</td></tr>`;
  }

  // ------------------------------THE MAT ITSELF -----------------------------------------------------//

  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      if (cell.isMine && cell.isShown && gInt === 'off') { //MINE 
        strHTML += `<td style="background-color:${cell.color};" class="cell" >${MINE}</td>`;
      } else if (cell.isShown) {
        strHTML += `<td style="background-color:${cell.color}; color:${cell.innerTextColor};" class="cell">${cell.type}</td>`;
      } else if (cell.isMarked && !cell.isShown) { // FLAGS
        strHTML += `<td style="background-color:${cell.color}; " onmousedown="cellClicked(event, ${i} , ${j})"
        class="cell">${FLAG}</td>`;
      } else if (cell.isMine && gGame.state === 'dead') {
        strHTML += `<td style="background-color:${cell.color};" class="cell">${MINE}</td>`;
      } else
        strHTML += `<td style="background-color:${cell.color};" onmousedown="cellClicked(event, ${i} , ${j})"
        class="cell"></td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  //------------------------------LIFE SEC-----------------------------------------------------------------//
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function showDifflcultButtons() {
  var strHTML =
    ` <div class = "buttons-container">
  <button class="difficultButton" data-id="1" onClick="diffButtonClicked(this)">Begginer</button>
  <button class="difficultButton" data-id="2" onClick="diffButtonClicked(this)">Medium</button>
  <button class="difficultButton" data-id="3" onClick="diffButtonClicked(this)">Expert</button>
  </div> `;
  strHTML += `<button class="help" onClick="intButtonClicked()"> Int![left:<span class="ints">${gIntsLeft}</span>] </button>`;
  strHTML += `<button class="putMines" onClick="postionsMineMenuellyButtonClicked()"> PUT IT YOURSELF! 
  BOMBS:<span>${gNumberOfMinesToPut}</span></button>`;
  strHTML += `<button class="undo" onClick="undoButtonClicked()">UNDO!</button>`;
  strHTML += `<button class="safeClick" onClick="safeButtonClicked()">
               SAFE CLICK! (<span>${gSafeClicks}</span>)</button>`;
  document.querySelector('.diffButtons').innerHTML = strHTML;

}

function unShownBoard() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      cell.isMarked = false;
      cell.isShown = false;
      cell.color = 'grey';
    }
  }
}

function colorOfTheText(cell) {
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
      cell.innerTextColor = 'hsl(266, 69%, 18%)';
      break;
    case 5:
      cell.innerTextColor = 'brown';
      break;
    case 6:
      cell.innerTextColor = 'rgb(108, 162, 184);';
      break;
    case 7:
      cell.innerTextColor = 'black';
      break;
    case 8:
      cell.innerTextColor = 'rgb(95, 90, 90)';
      break;
    default:
      break;
  }
  return cell.innerTextColor;
}