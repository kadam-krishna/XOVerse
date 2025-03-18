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

const winnerPatterns = [];
for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 3; j++) {
        winnerPatterns.push([i * 7 + j, i * 7 + j + 1, i * 7 + j + 2, i * 7 + j + 3, i * 7 + j + 4]); // Rows
        winnerPatterns.push([j * 7 + i, (j + 1) * 7 + i, (j + 2) * 7 + i, (j + 3) * 7 + i, (j + 4) * 7 + i]); // Columns
    }
}
winnerPatterns.push([0, 8, 16, 24, 32]);
winnerPatterns.push([1, 9, 17, 25, 33]);
winnerPatterns.push([2, 10, 18, 26, 34]); 
winnerPatterns.push([4, 10, 16, 22, 28]);
winnerPatterns.push([5, 11, 17, 23, 29]); 
winnerPatterns.push([6, 12, 18, 24, 30]);

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
