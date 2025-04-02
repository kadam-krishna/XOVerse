let board = document.querySelectorAll(".box");
let rstBtn = document.querySelector("#reset");
let newBtn = document.querySelector("#newGame");
let result = document.querySelector(".winner");
let winnerDetails = document.querySelector("#winnerResult");
let turn = document.getElementById("turn");
let scoreO = document.querySelector("#scoreO");
let scoreX = document.querySelector("#scoreX");

let botScore = 0;
let playerScore = 0;
let turnO = false;

const winnerPatterns = [
  [ 0, 1, 2, 3 ],     [ 1, 2, 3, 4 ],
  [ 5, 6, 7, 8 ],     [ 6, 7, 8, 9 ],
  [ 10, 11, 12, 13 ], [ 11, 12, 13, 14 ],
  [ 15, 16, 17, 18 ], [ 16, 17, 18, 19 ],
  [ 20, 21, 22, 23 ], [ 21, 22, 23, 24 ],
  [ 0, 5, 10, 15 ],   [ 5, 10, 15, 20 ],
  [ 1, 6, 11, 16 ],   [ 6, 11, 16, 21 ],
  [ 2, 7, 12, 17 ],   [ 7, 12, 17, 22 ],
  [ 3, 8, 13, 18 ],   [ 8, 13, 18, 23 ],
  [ 4, 9, 14, 19 ],   [ 9, 14, 19, 24 ],
  [ 0, 6, 12, 18 ],   [ 1, 7, 13, 19 ],
  [ 5, 11, 17, 23 ],  [ 6, 12, 18, 24 ],
  [ 3, 7, 11, 15 ],   [ 4, 8, 12, 16 ],
  [ 8, 12, 16, 20 ],  [ 9, 13, 17, 21 ]
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
  result.classList.add("hide");
};

const turnMessage = () => {
  if (turnO) {
    turn.innerText = "Bot's Turn (O)";
    turn.style.color = "#1f51ff";
    botMove();
  } else {
    turn.innerText = "Your Turn (X)";
    turn.style.color = "#ff5333";
  }
};

const checkWinner = () => {
  let grid = Array.from(board).map((box) => box.innerText);
  for (let pattern of winnerPatterns) {
    let [a, b, c, d] = pattern;
    if (grid[a] && grid[a] === grid[b] && grid[b] === grid[c] && grid[c] === grid[d]) {
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
const printWinner = (winner) => {
  winnerDetails.innerText = winner === "O" ? "Bot Wins!" : "You Win!";
  if (winner === "O") botScore++;
  else playerScore++;
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
  if(depth==4){
    return 0;
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 25; i++) {
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
    for (let i = 0; i < 25; i++) {
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
    let [a, b, c, d] = pattern;
    if (grid[a] && grid[a] === grid[b] && grid[b] === grid[c] && grid[c] === grid[d]) {
      return grid[a];
    }
  }
  if (grid.every(cell => cell !== "")) return "tie";
  return null;
};

const bestMove = () => {
  let grid = Array.from(board).map((box) => box.innerText || "");
  let bestScore = -Infinity;
  let move = null;
  for (let i = 0; i < 25; i++) {
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

board.forEach((box) => {
  box.addEventListener("click", () => {
    if (!turnO && box.innerText === "") {
      box.innerText = "X";
      box.style.color = "#ff5333";
      box.disabled = true;
      turnO = true;
      if (!checkWinner()) turnMessage();
    }
  });
});

newBtn.addEventListener("click", newGame);
rstBtn.addEventListener("click", resetGame);
turnMessage();
