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
      board.resetBoard();
      board.printBoard();
      console.log(`${activePlayer.name} gets first turn for winning.`);
      return;
    }

    const gameTied = tie();
    if (gameTied) {
      board.printBoard();
      board.resetBoard();
      board.printBoard();
      return;
    }

    switchTurn();
    printNewRound();
  };

  printNewRound();
  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn. Pick your cell!`;

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
    if (!selectedCellRow && !selectedCellColumn) return;

    game.playRound(selectedCellRow, selectedCellColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();
