let board = document.querySelectorAll('.box');
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
let turnO = Math.random() < 0.5;

const winnerPatterns = [];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 2; j++) {
        winnerPatterns.push([i * 5 + j, i * 5 + j + 1, i * 5 + j + 2, i * 5 + j + 3]); // Rows
        winnerPatterns.push([j * 5 + i, (j + 1) * 5 + i, (j + 2) * 5 + i, (j + 3) * 5 + i]); // Columns
    }
}
winnerPatterns.push([0, 6, 12, 18]);
winnerPatterns.push([1, 7, 13, 19]);
winnerPatterns.push([5, 11, 17, 23]);
winnerPatterns.push([4, 8, 12, 16]);
winnerPatterns.push([9, 13, 17, 21]);
winnerPatterns.push([14, 18, 22, 26]);

const updateTurnDisplay = () => {
    if (turnO) {
        turn.innerText = "Bot's Turn(O)";
        turn.style.color = "#1f51ff";
        botMove();
    } else {
        turn.innerText = "Your Turn(X)";
        turn.style.color = "#ff3333";
    }
};

const resetGame = () => {
    turnO = false;
    enableInput();
    botScore = 0;
    playerScore = 0;
    result.classList.add("hide");
    updateTurnDisplay();
    if (turnO) botMove();
};

const newGame = () => {
    turnO = Math.random() < 0.5;
    enableInput();
    result.classList.add("hide");
    game.style.display = "block";
    updateTurnDisplay();
    if (turnO) botMove();
};

const printWinner = (winner) => {
    winnerDetails.innerText = winner === "O" ? "Bot Wins!" : "You Win!";
    if (winner === "O") botScore++;
    else playerScore++;

    scoreO.innerText = `Bot Score: ${botScore}`;
    scoreX.innerText = `Your Score: ${playerScore}`;

    game.style.display = "none";
    result.classList.remove("hide");
};

const printDraw = () => {
    winnerDetails.innerText = "It's a Draw!";
    scoreO.innerText = `Bot Score: ${botScore}`;
    scoreX.innerText = `Your Score: ${playerScore}`;
    game.style.display = "none";
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
};

const checkWinner = () => {
    for (let pattern of winnerPatterns) {
        let values = pattern.map(index => board[index]?.innerText || "");
        if (values.every(v => v === "O")) {
            printWinner("O");
            disableInput();
            return true;
        } else if (values.every(v => v === "X")) {
            printWinner("X");
            disableInput();
            return true;
        }
    }
    if ([...board].every(box => box.innerText !== "")) {
        printDraw();
        disableInput();
        return true;
    }
    return false;
};

// Minimax Algorithm for AI
const minimax = (newBoard, isMaximizing) => {
    let emptySpots = [];
    for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i].innerText === "") emptySpots.push(i);
    }

    if (checkWin(newBoard, "O")) return { score: 10 };
    if (checkWin(newBoard, "X")) return { score: -10 };
    if (emptySpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i of emptySpots) {
        let move = {};
        move.index = i;
        newBoard[i].innerText = isMaximizing ? "O" : "X";

        let result = minimax(newBoard, !isMaximizing);
        move.score = result.score;

        newBoard[i].innerText = "";
        moves.push(move);
    }

    let bestMove = moves.reduce((best, move) => 
        (isMaximizing ? move.score > best.score : move.score < best.score) ? move : best
    );

    return bestMove;
};

// Check if a player has won
const checkWin = (boardState, player) => {
    return winnerPatterns.some(pattern =>
        pattern.every(index => boardState[index].innerText === player)
    );
};

// AI Move
const botMove = () => {
    if (!turnO) return; // Only execute if it's Bot's turn

    let bestMove = minimax([...board], true).index;
    board[bestMove].innerText = "O";
    board[bestMove].style.color = "#1f51ff";
    board[bestMove].disabled = true;

    if (!checkWinner()) {
        turn.innerText = "Your Turn(X)";
        turn.style.color = "#ff3333";
        turnO = false;
    }
};

// Player Move
board.forEach((box) => {
    box.addEventListener("click", () => {
        if (!turnO) {
            box.innerText = "X";
            box.style.color = "#ff3333";
            box.disabled = true;
            turnO = true;

            if (!checkWinner()) {
                turn.innerText = "Bot's Turn(O)";
                turn.style.color = "#1f51ff";
                botMove();
            }
        }
    });
});

newBtn.addEventListener("click", newGame);
rstBtn.addEventListener("click", resetGame);

updateTurnDisplay();
