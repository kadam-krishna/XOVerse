let board = document.querySelectorAll('.box');
let rstBtn = document.querySelector(".reset");
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
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [3, 4, 5], [6, 7, 8]
];

const resetGame = () => {
    turnO = false; 
    enableInput();
    botScore = 0;
    playerScore = 0;
    result.classList.add("hide");
    updateTurnDisplay();
    if (turnO) botMove(); 
}

const newGame = () => {
    turnO = Math.random() < 0.5;
    enableInput();
    game.style.display = "block";
    result.classList.add("hide");
    updateTurnDisplay();
    if (turnO) botMove();
}

const updateTurnDisplay = () => {
    if (turnO) {
        turn.innerText = "Bot's Turn (O)";
        turn.style.color = "#1f51ff";
        botMove();
    } else {
        turn.innerText = "Your Turn (X)";
        turn.style.color = "#ff5333";
    }
}

const printWinner = (winner) => {
    winnerDetails.innerText = winner === "O" ? "Bot Wins!" : "You Win!";
    
    if (winner === "O") botScore++;
    else playerScore++;

    scoreO.innerText = `Bot Score: ${botScore}`;
    scoreX.innerText = `Your Score: ${playerScore}`;
    
    game.style.display = "none";
    result.classList.remove("hide");
}

const printDraw = () => {
    winnerDetails.innerText = `It's a Draw!`;
    scoreO.innerText = `Bot Score: ${botScore}`;
    scoreX.innerText = `Your Score: ${playerScore}`;
    game.style.display = "none";
    result.classList.remove("hide");
}

const disableInput = () => {
    board.forEach(box => box.disabled = true);
}

const enableInput = () => {
    board.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
}

const checkWinner = () => {
    for (let pattern of winnerPatterns) {
        let [p1, p2, p3] = pattern.map(i => board[i].innerText);

        if (p1 !== "" && p1 === p2 && p2 === p3) {
            printWinner(p1);
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
}

const minimax = (newBoard, isMaximizing) => {//Algo
    let emptySpots = [];
    for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i].innerText === "") emptySpots.push(i);
    }

    if (checkWin(newBoard, "O")) return { score: 1 };
    if (checkWin(newBoard, "X")) return { score: -1 };
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
}

const checkWin = (boardState, player) => {
    return winnerPatterns.some(pattern =>
        pattern.every(index => boardState[index].innerText === player)
    );
}
const botMove = () => {
    if (!turnO) return; 

    let bestMove = minimax([...board], true).index;
    board[bestMove].innerText = "O";
    board[bestMove].style.color = "#1f51ff";
    board[bestMove].disabled = true;

    if (!checkWinner()) {
        turn.innerText = "Your Turn (X)";
        turn.style.color = "#ff5333";
        turnO = false;
    }
}

board.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (!turnO) {
            box.innerText = "X";
            box.style.color = "#ff5333";
            box.disabled = true;
            turnO = true;

            if (!checkWinner()) {
                turn.innerText = "Bot's Turn (O)";
                turn.style.color = "#1f51ff";
                botMove();
            }
        }
    });
});

newBtn.addEventListener("click", newGame);
rstBtn.addEventListener("click", resetGame);
updateTurnDisplay();
