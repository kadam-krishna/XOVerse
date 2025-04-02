let board = document.querySelectorAll('.box');
let rstBtn = document.querySelector("#reset");
let newBtn = document.querySelector("#newGame");
let result = document.querySelector(".winner");
let winnerDetails = document.querySelector("#winnerResult");
let turn = document.getElementById("turn");
let scoreO = document.querySelector("#scoreO");
let scoreX = document.querySelector("#scoreX");
let game = document.getElementById("#main");
let playerOScore = 0;
let playerXScore = 0;
let turnO = Math.random() > 0.5;
turn.innerText = turnO ? "Player O's turn" : "Player X's turn";
turn.style.color = turnO ? "#1f51ff" : "#ff5333";

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

const resetGame = () => {
    turnO = Math.random() > 0.5;
    enableInput();
    playerOScore = 0;
    playerXScore = 0;
    updateScores();
    result.classList.add("hide");
};

const newGame = () => {
    turnO = Math.random() > 0.5;
    enableInput();
    result.classList.add("hide");
};

const updateScores = () => {
    scoreO.innerText = `Player O Score: ${playerOScore}`;
    scoreX.innerText = `Player X Score: ${playerXScore}`;
};

const printWinner = (winner) => {
    winnerDetails.innerText = `Player ${winner} wins!`;
    if (winner === "O") {
        playerOScore++;
    } else {
        playerXScore++;
    }
    updateScores();
    result.classList.remove("hide");
};

const printDraw = () => {
    winnerDetails.innerText = "It's a Draw!";
    updateScores();
    result.classList.remove("hide");
};

const disableInput = () => {
    board.forEach(box => box.disabled = true);
};

const enableInput = () => {
    board.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
    turn.innerText = turnO ? "Player O's turn" : "Player X's turn";
    turn.style.color = turnO ? "#1f51ff" : "#ff3333";
};

const checkWinner = () => {
    for (let pattern of winnerPatterns) {
        let values = pattern.map(index => board[index]?.innerText || "");
        if (values.every(v => v === "O")) {
            printWinner("O");
            disableInput();
            return;
        } else if (values.every(v => v === "X")) {
            printWinner("X");
            disableInput();
            return;
        }
    }
    if ([...board].every(box => box.innerText !== "")) {
        printDraw();
        disableInput();
    }
};

board.forEach((box) => {
    box.addEventListener("click", () => {
        box.innerText = turnO ? "O" : "X";
        box.style.color = turnO ? "#1f51ff" : "#ff3333";
        turn.innerText = turnO ? "Player X's turn" : "Player O's turn";
        turn.style.color = turnO ? "#ff3333" : "#1f51ff";
        turnO = !turnO;
        box.disabled = true;
        checkWinner();
    });
});

newBtn.addEventListener("click", newGame);
rstBtn.addEventListener("click", resetGame);
