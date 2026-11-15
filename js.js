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

  return { getBoard, placeMark, printBoard };
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

  const playRound = (row, column) => {
    console.log(`${activePlayer.name} marks square ${row}, ${column}..`);

    const marked = board.placeMark(activePlayer.token, row, column);
    if (!marked) {
      console.log("That square is already Marked. Try again!");
      return;
    }

    const gameOver = () => {
      if (hasWon) {
      }
    };
    switchTurn();
    printNewRound();
  };

  printNewRound();
  return { playRound, getActivePlayer };
}

const game = GameController();

/* [00 01 02], [10 11 12], [20 21 22]
   [00 10 20], [01 11 21], [02 12 22]
   [00 11 22], [02 11 20]  */
