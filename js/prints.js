var gFaceCollapse = 2
var gScoreCollapse = 1;
var gTimerCollapse = 1;

function printTime() {
  var elLocationForTime = document.querySelector('.timer')
  elLocationForTime.innerHTML = gTimeStr;
}

function changeFace() {
  gGame.loseOrWin = 'clickedOnEmpty'
  printMat(gBoard, '.board-container');
  setTimeout(function () {
    gGame.loseOrWin = ''
    printMat(gBoard, '.board-container');
  }, 200)
}

//---------------------------PRINT MAT -------------------------------------------------------------------//

function printMat(mat, selector) {
  var strHTML = '<div class="life-container"><span>LIVES:</span>';
  for (var i = 0; i < gGame.lifeCount; i++) {
    strHTML += LIFE;
  }
  strHTML += '</div>';
  strHTML += '<table border="10"><tbody>';
  
  //-------------------------------------------------------header with pics---------------------------//
  
  if (gGame.loseOrWin === '' || gGame.loseOrWin === 'win') {
    strHTML += `<tr><td class="timer" colspan="${gTimerCollapse}">${gTimeStr}</td>`
    strHTML += `<td class="faceCell" colspan="${gFaceCollapse}" onClick="resetGame()"><img src="./img/normal.png" class="face"></td>`
    strHTML += `<td class="scoreValue" colspan="${gScoreCollapse}">${gGame.score}</td></tr>`
  } else if (gGame.loseOrWin === 'clickedOnEmpty') {
    strHTML += `<tr><td class="timer" colspan="${gTimerCollapse}">${gTimeStr}</td>`
    strHTML += `<td class="faceCell" colspan="${gFaceCollapse}" onClick="resetGame()">'<img src="./img/clickedOn.png" class="face"></td>`
    strHTML += `<td class="scoreValue" colspan="${gScoreCollapse}">${gGame.score}</td></tr>`
  } else {
    strHTML += `<tr><td class="timer" colspan="${gTimerCollapse}">${gTimeStr}</td>`
    strHTML += `<td class="faceCell" colspan="${gFaceCollapse}" onClick="resetGame()"><img src="./img/dead.png" class="face"></td>`
    strHTML += `<td class="scoreValue" colspan="${gScoreCollapse}">${gGame.score}</td></tr>`
  }

  // ------------------------------THE MAT ITSELF -----------------------------------------------------//
  
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      if (cell.isMine && cell.isShown) { //MINE 
        strHTML += `<td style="background-color:${cell.color};" class="cell" >${MINE}</td>`;
      } else if (cell.isShown) {
        debugger;
        strHTML += `<td style="background-color:${cell.color}; color:${cell.innerTextColor};" class="cell">${cell.type}</td>`;
      } else if (cell.isMarked && !cell.isShown) { // FLAGS
        strHTML += `<td style="background-color:${cell.color}; " onmousedown="cellClicked(event, ${i} , ${j})"
        class="cell">${FLAG}</td>`;
      } else if (cell.isMine && gGame.loseOrWin === 'dead') {
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
  strHTML =
    ` <div class = "buttons-container">
  <button class="difficultButton" data-id="1" onClick="diffButtonClicked(this)">Begginer</button>
  <button class="difficultButton" data-id="2" onClick="diffButtonClicked(this)">Medium</button>
  <button class="difficultButton" data-id="3" onClick="diffButtonClicked(this)">Expert</button>
  </div> `
  document.querySelector('.diffButtons').innerHTML = strHTML;
}