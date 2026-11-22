function Cell() {
  let value = "";

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addMark, getValue };
}

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < columns; c++) {
      board[r].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMark = (player, row, column) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addMark(player);
      return true;
    }
    return false;
  };

  const printBoard = () => {
    const values = board.map((row) => row.map((cell) => cell.getValue()));
    console.table(values);
  };

  const resetBoard = () => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        board[r][c].addMark("");
      }
    }
  };

  return { getBoard, placeMark, printBoard, resetBoard };
}

function GameController(
  playerOneName = "Player X",
  playerTwoName = "Player O",
) {
  const board = Gameboard();

  const players = [
    { name: playerOneName, token: "X" },
    { name: playerTwoName, token: "O" },
  ];

  let activePlayer = players[0];

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s turn.`);
  };

  const won = () => {
    const winningRows = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
    const grid = board.getBoard();
    const hasWon = winningRows.some((line) =>
      line.every(([r, c]) => grid[r][c].getValue() === activePlayer.token),
    );
    if (hasWon) {
      console.log(`${activePlayer.name} has 3 in a row, they win!`);
    }
    return hasWon;
  };

  const tie = () => {
    const grid = board.getBoard();
    const isTie = grid.every((row) =>
      row.every((cell) => cell.getValue() !== ""),
    );
    if (isTie) {
      console.log("The board is full. Cat's Game.");
    }
    return isTie;
  };

  const playRound = (row, column) => {
    console.log(`${activePlayer.name} marks square ${row}, ${column}..`);

    const marked = board.placeMark(activePlayer.token, row, column);
    if (!marked) {
      console.log("That square is already Marked. Try again!");
      return;
    }

    const gameOver = won();
    if (gameOver) {
      board.printBoard();
      console.log(`${activePlayer.name} gets first turn for winning.`);
      return "win";
    }

    const gameTied = tie();
    if (gameTied) {
      board.printBoard();
      switchTurn();
      return "tie";
    }

    switchTurn();
    printNewRound();
  };

  printNewRound();
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    resetBoard: board.resetBoard,
  };
}

function ScreenController() {
  const game = GameController();
  let gameOver = true;
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const newGameBtn = document.querySelector(".new-game");

  const updateScreen = (result) => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    if (result === "win") {
      playerTurnDiv.textContent = `${activePlayer.name} got three in a row! They Reign Supreme!`;
    } else if (result === "tie") {
      playerTurnDiv.textContent = "The board is full. Cat's game.";
    } else if (result === "start") {
      playerTurnDiv.textContent = "Press New Game to Start";
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn. Pick your cell!`;
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedCellRow = e.target.dataset.row;
    const selectedCellColumn = e.target.dataset.column;

    if (gameOver || (!selectedCellRow && !selectedCellColumn)) return;

    const result = game.playRound(selectedCellRow, selectedCellColumn);

    if (result === "win" || result === "tie") {
      gameOver = true;
    }

    updateScreen(result);
  }

  function newGameHandler() {
    gameOver = false;
    game.resetBoard();
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
  newGameBtn.addEventListener("click", newGameHandler);
  updateScreen("start");
}

ScreenController();
