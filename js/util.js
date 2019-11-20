function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printTime() {
  var elLocationForTime = document.querySelector('.timer')
  elLocationForTime.innerHTML = gTimerCounter;
}


//---------------------------PRINT MAT -------------------------------------------------------------------//

function printMat(mat, selector) {
  var strHTML = '<table border="4"><tbody>';
  if (gGame.loseOrWin === '' || gGame.loseOrWin === 'win') {
    strHTML += `<tr><td class="timer">${gTimerCounter}</td>`
    strHTML += '<td class="smiley" colspan="2" onClick="resetGame()">😃</td>'
    strHTML += `<td class="scoreValue">${gGame.score}</td></tr>`
  } else {
    strHTML += `<tr><td class="timer">${gTimerCounter}</td>`
    strHTML += '<td class="smiley" colspan="2" onClick="resetGame()">😭</td>'
    strHTML += `<td class="scoreValue">${gGame.score}</td></tr>`
  }
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell-' + i + '-' + j;
      if (cell.isMine && cell.isShown) { //MINE 
        strHTML += `<td style="background-color:${cell.color};">${MINE}</td>`
      } else
      if (cell.isShown && cell.isNearCell) { //NUMBER NEAR BY
        strHTML += `<td style="background-color:${cell.color};" class="${className}">${cell.type}</td>`
      } else if (cell.isShown || cell.isNearCell) { //NUMBER THAT CLICK
        strHTML += `<td style="background-color:${cell.color};" onmousedown="cellClicked(event, ${i} , ${j})" 
      class="${className}">${cell.type}</td>`
      } else if (cell.isMarked && !cell.isShown) { // FLAGS
        strHTML += `<td style="background-color:${cell.color};" onmousedown="cellClicked(event, ${i} , ${j})">${FLAG}</td>`
      } else { // STILL NOT AVAILBLE
        strHTML += `<td style="background-color:${cell.color};" onmousedown="cellClicked(event, ${i} , ${j})" 
      class="${className}"></td>`
      }
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}



//--------------------------------------------------------------------------------------------------------------//
