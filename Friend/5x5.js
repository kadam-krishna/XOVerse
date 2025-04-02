let board = document.querySelectorAll('.box');
let rstBtn = document.querySelector("#reset");
let newBtn = document.querySelector("#newGame");
let result = document.querySelector(".winner");
let winnerDetails = document.querySelector("#winnerResult");
let turn = document.getElementById("turn");
let scoreO = document.querySelector("#scoreO");
let scoreX = document.querySelector("#scoreX");
let game = document.getElementById("main");

let playerOScore = 0;
let playerXScore = 0;
let turnO = Math.random() > 0.5;
turn.innerText = turnO ? "Player O's turn" : "Player X's turn";
turn.style.color = turnO ? "#1f51ff" : "#ff3333";

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
    game.style.display="block";
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
    scoreO.innerText = `Player O Score: ${playerOScore}`;
    scoreX.innerText = `Player X Score: ${playerXScore}`;
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
            game.style.display="none";
            return;
        } else if (values.every(v => v === "X")) {
            printWinner("X");
            disableInput();
            game.style.display="none";
            return;
        }
    }
    if ([...board].every(box => box.innerText !== "")) {
        printDraw();
        disableInput();
        game.style.display="none";
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
