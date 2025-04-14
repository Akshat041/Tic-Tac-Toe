function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // 2d array that will represent the state of the game board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  // adding mark if the cell doesn't have a players markings
  const addMarkAt = (row, column, player) => {
    if (board[row][column].getValue() !== null) {
      console.log("Cell is already occupied");
      return false;
    }

    board[row][column].addMark(player);
    return true;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.table(boardWithCellValues);
  };

  return { getBoard, addMarkAt, printBoard };
}

function Cell() {
  let value = null;

  // Accept a player's mark to change the value of the cell
  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue,
  };
}

/*
 ** The GameController will be responsible for controlling the
 ** flow and state of the game's turns, as well as whether
 ** anybody has won the game
 */
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
  playerOneImgSrc = "./img/cross.png",
  playerTwoImgSrc = "./img/circle.png"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      marking: `<img src = "${playerOneImgSrc}" alt = "X">`,
    },
    {
      name: playerTwoName,
      marking: `<img src = "${playerTwoImgSrc}" alt = "O">`,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    console.log(`${getActivePlayer().name}'s turn.`);
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
  };

  // winning logic
  const checkWinner = () => {
    const brd = board.getBoard();
    const playerMark = getActivePlayer().marking;

    //   for rows
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 1; j++) {
        if (
          brd[i][j].getValue() === playerMark &&
          brd[i][j + 1].getValue() === playerMark &&
          brd[i][j + 2].getValue() === playerMark
        ) {
          return { winner: getActivePlayer().name, isGameOver: true };
        }
      }
    }
    //   for columns
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          brd[i][j].getValue() === playerMark &&
          brd[i + 1][j].getValue() === playerMark &&
          brd[i + 2][j].getValue() === playerMark
        ) {
          return { winner: getActivePlayer().name, isGameOver: true };
        }
      }
    }

    //   for left diagonal
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 1; j++) {
        if (
          brd[i][j].getValue() === playerMark &&
          brd[i + 1][j + 1].getValue() === playerMark &&
          brd[i + 2][j + 2].getValue() === playerMark
        ) {
          return { winner: getActivePlayer().name, isGameOver: true };
        }
      }
    }

    //   for right diagonal
    for (let i = 0; i <= 0; i++) {
      for (let j = 2; j >= 2; j--) {
        if (
          brd[i][j].getValue() === playerMark &&
          brd[i + 1][j - 1].getValue() === playerMark &&
          brd[i + 2][j - 2].getValue() === playerMark
        ) {
          return { winner: getActivePlayer().name, isGameOver: true };
        }
      }
    }
    return { winner: null, isGameOver: false };
  };

  // checking for draw
  const isDraw = () => {
    const brd = board.getBoard();
    for (let row of brd) {
      for (let cell of row) {
        if (cell.getValue() === null) {
          return false;
        }
      }
    }
    return true;
  };

  const playRound = (row, column) => {
    console.log(
      `Marking ${
        getActivePlayer().name
      }'s marking at ${row} row and ${column} column...`
    );

    if (board.addMarkAt(row, column, getActivePlayer().marking)) {
      const winResult = checkWinner();

      if (winResult.isGameOver) {
        console.log(`${getActivePlayer().name} Wins!`);
        board.printBoard();

        return winResult;
      }

      if (isDraw()) {
        console.log("It's a draw");
        board.printBoard();

        return { winner: "Draw", isGameOver: true };
      }

      printNewRound();
      switchPlayerTurn();
    }

    return { winner: null, isGameOver: false };
  };

  // Initial play game message
  printNewRound();

  return {
    checkWinner,
    isDraw,
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  let game;

  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const introDialog = document.querySelector("#introDialog");
  const introForm = document.querySelector("#introForm");

  const winnerDialog = document.querySelector("#winnerDialog");
  const homeBtn = document.querySelector("#home");
  const playAgainBtn = document.querySelector("#playAgain");
  const winnerMessage = document.querySelector("#winnerMessage");
  const gameContainer = document.querySelector(".game-container");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // Render board squares
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.row = i;
        cellButton.dataset.column = j;
        cellButton.innerHTML = cell.getValue() || "";
        boardDiv.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedColumn || !selectedRow) return;

    const roundResult = game.playRound(selectedRow, selectedColumn);
    updateScreen();

    if (roundResult.isGameOver) {
      winnerMessage.textContent =
        roundResult.winner === "Draw"
          ? "It's a Draw!"
          : `${roundResult.winner} Wins!`;

      winnerDialog.showModal();
      gameContainer.style.display = "none";

      boardDiv.removeEventListener("click", clickHandlerBoard);
    }
  }

  introDialog.showModal();

  introForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const player1Name = document.querySelector("#player1").value;
    const player2Name = document.querySelector("#player2").value;

    game = GameController(
      player1Name,
      player2Name,
      "./img/cross.png",
      "./img/circle.png"
    );

    introDialog.close();

    gameContainer.style.cssText =
      "display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0 auto";

    updateScreen();

    boardDiv.addEventListener("click", clickHandlerBoard);
  });

  homeBtn.addEventListener("click", () => {
    winnerDialog.close();
    introDialog.showModal();

    document.querySelector("#player1").value = "";
    document.querySelector("#player2").value = "";
  });

  playAgainBtn.addEventListener("click", () => {
    winnerDialog.close();

    const player1Name = document.querySelector("#player1").value;
    const player2Name = document.querySelector("#player2").value;
    game = GameController(
      player1Name,
      player2Name,
      "./img/cross.png",
      "./img/circle.png"
    );

    gameContainer.style.cssText =
      "display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0 auto";

    updateScreen();

    boardDiv.addEventListener("click", clickHandlerBoard);
  });

  document.getElementById("restartGame").addEventListener("click", () => {
    gameContainer.style.display = "none";
    introDialog.showModal();
    boardDiv.removeEventListener("click", clickHandlerBoard);
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
  });
}

ScreenController();
