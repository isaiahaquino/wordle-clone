const GameBoard = (() => {

  let currentRow = 1;
  let currentIndex = 1;
  let currentWord = '';
  let answer = '';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '6f8f5abfa2mshc3a6db73b8ccd9bp126fd2jsnd8366ac803ff',
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
    }
  };
  
  function setGame() {
    fetch('https://wordsapiv1.p.rapidapi.com/words/?random=true&letters=5', options)
    .then(response => response.json())
    .then(response => {
      answer = response.word.toUpperCase();
      const pop = document.querySelector('#popupAnswer');
      pop.innerHTML = pop.innerHTML.concat(answer);
      console.log(`Answer: ${answer}`);
    })
    .catch(err => console.error(err));

    setKeys();
  }

  function setKeys() {
    const keys = document.querySelectorAll('.key');
    keys.forEach((key) => {
      key.addEventListener('click', () => {
        pressButton(key.id);
      });
    })

    document.addEventListener('keydown', (e) => {
      if (/Key\w/.test(e.code)) {
        pressButton(e.code[3]);
      } else if (e.code == 'Backspace') {
        pressButton('DEL');
      } else if (e.code == 'Enter') {
        pressButton('ENTER');
      }
    });

    const popup = document.querySelector('.mainEndPopup');
    const close = document.querySelector('#close');
    close.addEventListener('click', () => {
      popup.style.display = 'none';
    });

    const restart = document.querySelector('#resetBtn');
    restart.addEventListener('click', () => {
      popup.style.display = 'none';
      const greet = document.querySelectorAll('.popupGreet');
      greet.forEach(h1 => h1.style.display = 'none')
      document.querySelector('#popupAnswer').innerHTML = 'Word: ';
      restart();
    })
  }

  function pressButton(id) {
    if (currentIndex == 6 && id == 'ENTER') {
      console.log('checking word..')
      // TODO: Check word that was entered
      if (currentWord == answer) {
        // TODO: CORRECT
        DisplayController.submitWord(answer, currentWord, currentRow);
        DisplayController.win();
      } else {
        // SUBMIT WORD
        DisplayController.submitWord(answer, currentWord, currentRow);
        currentIndex = 1;
        currentWord = '';
        currentRow++;
        if (currentRow == 7) {
          // TODO: YOU LOSE
          DisplayController.lose();
        }
      }
    } else if (id == 'DEL') {
      if (currentIndex > 1) {
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
  }

  function restart() {

  }

  return {setGame};

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

  function getRow(row) {
    const rowID = 'row'.concat(row);
    return document.querySelector(`#${rowID}`).childNodes;
  }

  function refreshWord(row, word) {
    const boxes = getRow(row);

    for (var i=0; i<5; i++) {
      const text = document.createElement('p');
      text.innerHTML = word[i];

      if (word[i] == undefined) {
        text.innerHTML = '';
        boxes[i].classList.remove('selected');
      }

      if (boxes[i].firstChild) {
        boxes[i].removeChild(boxes[i].firstChild);
      }

      boxes[i].appendChild(text);
      if (text.innerHTML != '') {
        boxes[i].classList.add('selected');
      }
    }
  }

    function submitWord(answer, word, row) {
      const boxes = getRow(row);

      for (let i=0; i<5; i++) {
        let letterInWord = false;
        const key = document.querySelector(`#${word[i]}`);
        for (let j=0; j<5; j++) {
          if (word[i] == answer[j] && i == j) {
            // word[i] is in the corect spot
            boxes[i].classList.add('correct');
            boxes[i].classList.remove('misplaced');
            key.classList.add('correct');
            key.classList.remove('misplaced');
            letterInWord = true;
            break;
          } else if (word[i] == answer[j] && i != j) {
            // word[i] is in word, but not in right spot
            boxes[i].classList.add('misplaced');
            key.classList.add('misplaced');
            letterInWord = true
          }
          if (!letterInWord && j == 4) {
            // word[i] is not in answer
            boxes[i].classList.add('wrong');
            key.classList.add('wrong');
          }
        }
      }
    }

    function win() {
      console.log("You win!");
      document.querySelector('.mainEndPopup').style.display = 'flex';
      document.querySelector('#win').style.display = 'block';

    }

    function lose() {
      console.log("You lose!");
      document.querySelector('.mainEndPopup').style.display = 'flex';
      document.querySelector('#lose').style.display = 'block';
    }

  return { displayBoard, refreshWord, submitWord, win, lose };

})();

DisplayController.displayBoard();
GameBoard.setGame();

