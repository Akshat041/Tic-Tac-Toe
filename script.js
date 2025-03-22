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
    if (board[row][column].getValue() !== 0) {
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
    console.log(boardWithCellValues);
  };

  return { getBoard, addMarkAt, printBoard };
}

function Cell() {
  let value = 0;

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
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      marking: "X",
    },
    {
      name: playerTwoName,
      marking: "O",
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
    for (let i = 0; i < 0; i++) {
      for (let j = 2; j >= 0; j--) {
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
        if (cell.getValue() === 0) {
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

const game = GameController();
// game.playRound(0, 0);
// game.playRound(1, 1);
// game.playRound(2, 2);
// game.playRound(0, 2);
// game.playRound(2, 0);
// game.playRound(1, 0);
// game.playRound(1, 2);
// game.playRound(1, 2);
// game.playRound(2, 1);
// game.playRound(1, 2);
// game.playRound(0, 1);
