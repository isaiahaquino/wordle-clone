const GameBoard = (() => {

  let currentRow = 1;
  let currentIndex = 1;
  let rowComplete = false;
  let currentWord = '';

  function setKeys() {
    const keys = document.querySelectorAll('.key');
    keys.forEach((key) => {
      key.addEventListener('click', () => {
        pressButton(key.id);
      });
    })
  }

  function pressButton(id) {
    if (rowComplete && id == 'ENTER') {
      // TODO: Check word that was entered
    }
    else if (id == 'DEL') {
      if (currentIndex > 1) {
        console.log('deleting')
        if (currentIndex == 1) {
          return;
        }
        // Remove letter
        currentWord = currentWord.slice(0, currentIndex-2);
        currentIndex--;
        DisplayController.refreshWord(currentRow, currentWord);
      }

    } else {
      if (currentIndex == 6) {
        return;
      }
      // Add letter
      currentWord = currentWord.concat(id);
      currentIndex++;
      DisplayController.refreshWord(currentRow, currentWord);
    }
    console.log(currentWord);
  }



  setKeys();

  return {};

})();

const DisplayController = (() => {

  function displayBoard() {
    const rows = document.querySelectorAll('.row');
    rows.forEach((row) => {
      for (var i=1; i<=5; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        row.appendChild(box);
      }
    });
  }

  function refreshWord(row, word) {
    const rowID = 'row'.concat(row);
    const boxes = document.querySelector(`#${rowID}`).childNodes;

    for (var i=0; i<5; i++) {
      const text = document.createElement('p');
      text.innerHTML = word[i];
      if (word[i] == null) {
        text.innerHTML = '';
      }

      while (boxes[i].firstChild) {
        boxes[i].removeChild(boxes[i].firstChild);
      }

      boxes[i].appendChild(text);

    }
  }

  return {displayBoard, refreshWord};

})();

DisplayController.displayBoard();