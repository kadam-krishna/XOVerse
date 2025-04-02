let board = document.querySelectorAll(".box");
let rstBtn = document.querySelector("#reset");
let newBtn = document.querySelector("#newGame");
let result = document.querySelector(".winner");
let winnerDetails = document.querySelector("#winnerResult");
let turn = document.getElementById("turn");
let scoreO = document.querySelector("#scoreO");
let scoreX = document.querySelector("#scoreX");
let game = document.getElementById("main");

let botScore = 0;
let playerScore = 0;
let turnO = false; 

const winnerPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]
];

const newGame = () => {
  turnO = false;
  enableInput();
  result.classList.add("hide");
};

const resetGame = () => {
  turnO = false;
  botScore = 0;
  playerScore = 0;
  enableInput();
  game.style.display="block";
  result.classList.add("hide");
};

const turnMessage = () => {
  if (turnO) {
    turn.innerText = "Bot's Turn (O)";
    turn.style.color = "#1f51ff";
    setTimeout(botMove, 500);
  } else {
    turn.innerText = "Your Turn (X)";
    turn.style.color = "#ff5333";
  }
};

const checkWinner = () => {
  let grid = Array.from(board).map((box) => box.innerText);

  for (let pattern of winnerPatterns) {
    let [a, b, c] = pattern;
    if (grid[a] && grid[a] === grid[b] && grid[b] === grid[c]) {
      printWinner(grid[a]);
      return true;
    }
  }

  if (grid.every((cell) => cell !== "")) {
    printDraw();
    return true;
  }

  return false;
};

const printWinner = (winner) => {
  winnerDetails.innerText = winner === "O" ? "Bot Wins!" : "You Win!";
  if (winner === "O"){
    botScore++;
  }else{
    playerScore++;
  }

  scoreO.innerText = `Bot Score: ${botScore}`;
  scoreX.innerText = `Your Score: ${playerScore}`;
  result.classList.remove("hide");
};

const printDraw = () => {
  winnerDetails.innerText = "It's a Draw!";
  scoreO.innerText = `Bot Score: ${botScore}`;
  scoreX.innerText = `Your Score: ${playerScore}`;
  result.classList.remove("hide");
};

const scores = {
  X: -1,  
  O: 1,   
  tie: 0 
};

const minimax = (grid, depth, isMaximizing) => {
  let result = getWinner(grid);
  if (result !== null) return scores[result];

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (grid[i] === "") {
        grid[i] = "O";
        let score = minimax(grid, depth + 1, false);
        grid[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (grid[i] === "") {
        grid[i] = "X";
        let score = minimax(grid, depth + 1, true);
        grid[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const getWinner = (grid) => {
  for (let pattern of winnerPatterns) {
    let [a, b, c] = pattern;
    if (grid[a] && grid[a] === grid[b] && grid[b] === grid[c]) {
      return grid[a];
    }
  }
  if (grid.every(cell => cell !== "")) {
    return "tie";
  }
  return null;
};

const bestMove = () => {
  let grid = Array.from(board).map((box) => box.innerText || "");
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < 9; i++) {
    if (grid[i] === "") {
      grid[i] = "O";
      let score = minimax(grid, 0, false);
      grid[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

const botMove = () => {
  if (!turnO) return;

  let move = bestMove();
  if (move !== null) {
    board[move].innerText = "O";
    board[move].style.color = "#1f51ff";
    board[move].disabled = true;
  }

  if (!checkWinner()) {
    turnO = false;
    turnMessage();
  }
};

board.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (!turnO && box.innerText === "") {
      box.innerText = "X";
      box.style.color = "#ff5333";
      box.disabled = true;
      turnO = true;
      if (!checkWinner()) {
        turnMessage();
      }
    }
  });
});
const disableInput = () => {
  board.forEach(box => box.disabled = true);
};

const enableInput = () => {
  board.forEach(box => {
      box.disabled = false;
      box.innerText = "";
  });
  turnMessage();
};
newBtn.addEventListener("click", newGame);
rstBtn.addEventListener("click", resetGame);
turnMessage();
