document.addEventListener("DOMContentLoaded", startGame);

function startGame() {
  const grid = document.querySelector(".tetris-grid");
  let squares = Array.from(document.querySelectorAll(".tetris-grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["#CEB1F0", "#F2823D", "#66EFF2", "#F0EF8D", "#A4B8EF"];

  //easter egg
  const finalRow = document.querySelectorAll(".tetris-black");
  const hackButton = document.getElementById('hack')

  const hackTetris = () => {
    finalRow.forEach((x) => {
      x.style.visibility = "visible";
    });

    clearInterval(timerId);
    alert("You found a secret!");
    let trick = confirm("do yo wanna more points?");

    if (trick) {
      score = score + 90;
      scoreDisplay.innerHTML = score;
      alert("you got it, don´t tell to anyone :)");
      setTimeout(() => {
        alert("sorry, I hate the cheaters");
        score = score - 150
        scoreDisplay.innerHTML = score
        gameOver();
      }, 2000);
    } else {
      alert("good for you");
      draw();
      timerId = setInterval(moveDown, 250);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  }

  hackButton.addEventListener('click', hackTetris)

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];
  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //random selection of tetromnino
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //dibujando tetromino

  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  //desdibujar
  function unDraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }
  // hacer que el tetromino baje cada segundo

  //asignar funciones al keycodes

  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener("keyup", control);

  //move down function

  function moveDown() {
    unDraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze function

  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // mover el tetromino a la izquierda, a menos que esté al borde

  function moveLeft() {
    unDraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  // mover a la derecha

  function moveRight() {
    unDraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  //rotate the tetromino

  function rotate() {
    unDraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }

    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  }

  //show up-next

  const displaySquares = document.querySelectorAll(".tetris-mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  //the tetrominos without rotations

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino,
  ];

  // display the shaoe in the mini-grid

  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });

    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  //funcionalidad al botón

  startBtn.addEventListener("click", startButton);

  function startButton() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      document.removeEventListener("keyup", control);
    } else {
      draw();
      timerId = setInterval(moveDown, 250);
      document.addEventListener("keyup", control);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  }

  // score

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });

        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // game over

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
      document.removeEventListener("keyup", control);
      startBtn.removeEventListener("click", startButton);
      startBtn.innerText = "Reset";
      startBtn.addEventListener("click", function start() {
        let containerGrid = document.getElementById("gridContainer").children;

        for (let i = 0; i < containerGrid.length - 10; i++) {
          containerGrid[i].classList.remove("taken");
          containerGrid[i].classList.remove("tetromino");
          containerGrid[i].style.backgroundColor = "";
        }

        startBtn.innerText = "Start/Pause";
        scoreDisplay.innerHTML = "0";
        startBtn.removeEventListener("click", start);

        startGame();
      });
    }
  }

  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return current.some((index) => (currentPosition + index + 1) % width === 0);
  }

  function isAtLeft() {
    return current.some((index) => (currentPosition + index) % width === 0);
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1; //if so, add one to wrap it back around
        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  }
}
