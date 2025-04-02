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
    [ 0, 1, 2, 3, 4 ],      [ 1, 2, 3, 4, 5 ],      [ 2, 3, 4, 5, 6 ],
    [ 7, 8, 9, 10, 11 ],    [ 8, 9, 10, 11, 12 ],   [ 9, 10, 11, 12, 13 ],
    [ 14, 15, 16, 17, 18 ], [ 15, 16, 17, 18, 19 ], [ 16, 17, 18, 19, 20 ],
    [ 21, 22, 23, 24, 25 ], [ 22, 23, 24, 25, 26 ], [ 23, 24, 25, 26, 27 ],
    [ 28, 29, 30, 31, 32 ], [ 29, 30, 31, 32, 33 ], [ 30, 31, 32, 33, 34 ],
    [ 35, 36, 37, 38, 39 ], [ 36, 37, 38, 39, 40 ], [ 37, 38, 39, 40, 41 ],
    [ 42, 43, 44, 45, 46 ], [ 43, 44, 45, 46, 47 ], [ 44, 45, 46, 47, 48 ],
    [ 0, 7, 14, 21, 28 ],   [ 7, 14, 21, 28, 35 ],  [ 14, 21, 28, 35, 42 ],
    [ 1, 8, 15, 22, 29 ],   [ 8, 15, 22, 29, 36 ],  [ 15, 22, 29, 36, 43 ],
    [ 2, 9, 16, 23, 30 ],   [ 9, 16, 23, 30, 37 ],  [ 16, 23, 30, 37, 44 ],
    [ 3, 10, 17, 24, 31 ],  [ 10, 17, 24, 31, 38 ], [ 17, 24, 31, 38, 45 ],
    [ 4, 11, 18, 25, 32 ],  [ 11, 18, 25, 32, 39 ], [ 18, 25, 32, 39, 46 ],
    [ 5, 12, 19, 26, 33 ],  [ 12, 19, 26, 33, 40 ], [ 19, 26, 33, 40, 47 ],
    [ 6, 13, 20, 27, 34 ],  [ 13, 20, 27, 34, 41 ], [ 20, 27, 34, 41, 48 ],
    [ 0, 8, 16, 24, 32 ],   [ 1, 9, 17, 25, 33 ],   [ 2, 10, 18, 26, 34 ],
    [ 7, 15, 23, 31, 39 ],  [ 8, 16, 24, 32, 40 ],  [ 9, 17, 25, 33, 41 ],
    [ 14, 22, 30, 38, 46 ], [ 15, 23, 31, 39, 47 ], [ 16, 24, 32, 40, 48 ],
    [ 4, 10, 16, 22, 28 ],  [ 5, 11, 17, 23, 29 ],  [ 6, 12, 18, 24, 30 ],
    [ 11, 17, 23, 29, 35 ], [ 12, 18, 24, 30, 36 ], [ 13, 19, 25, 31, 37 ],
    [ 18, 24, 30, 36, 42 ], [ 19, 25, 31, 37, 43 ], [ 20, 26, 32, 38, 44 ]
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
    let [a, b, c, d,e] = pattern;
    if (grid[a] && grid[a] === grid[b] && grid[b] === grid[c] && grid[c] === grid[d] && grid[d]==grid[e]) {
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
  if(depth==3){
    return 0;
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 49; i++) {
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
    for (let i = 0; i < 49; i++) {
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
    let [a, b, c, d,e] = pattern;
    if (grid[a] && grid[a] === grid[b] && grid[b] === grid[c] && grid[c] === grid[d] && grid[d]==grid[e]) {
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
  for (let i = 0; i < 49; i++) {
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
