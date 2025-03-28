let board = document.querySelectorAll('.box');
let rstBtn =  document.querySelector("#reset");
let newBtn = document.querySelector("#newGame");
let result = document.querySelector(".winner");
let winnerDetails = document.querySelector("#winnerResult");
let turn = document.getElementById("turn");
let scoreO = document.querySelector("#scoreO");
let scoreX = document.querySelector("#scoreX");
let game = document.getElementById("main");

let playerOScore = 0;
let playerXScore = 0;

let x = Math.random() * 2;
let turnO = x > 1 ? true : false;
if (turnO) {
    turn.innerText = "Player O's turn";
    turn.style.color = "#1f51ff";
    turnO=true;
} else {
    turn.innerText = "Player X's turn";
    turn.style.color = "#ff3333 ";
    turnO=false;
}

const winnerPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    turnO = true;
    enableinput();
    playerOScore = 0;
    playerXScore = 0;
    result.classList.add("hide");
}
const newGame = () => {
    turnO = true;
    enableinput();
    game.style.display="block";
    result.classList.add("hide");
}

const printWinner = (winner) => {
    winnerDetails.innerText = `Player ${winner} wins`;
    if (winner === "O") {
        playerOScore++;
    } else {
        playerXScore++;
    }
    scoreO.innerText = `Player O Score: ${playerOScore}`;
    scoreX.innerText = `Player X Score: ${playerXScore}`;
    game.style.display="none    ";
    result.classList.remove("hide");
}

const printDraw = () => {
    winnerDetails.innerText = `It's a Draw!`;
    scoreO.innerText = `Player O Score: ${playerOScore}`;
    scoreX.innerText = `Player X Score: ${playerXScore}`;
    game.style.display="none";
    result.classList.remove("hide");
}

const disableinput = () => {
    for (let box of board) {
        box.disabled = true;
    }
}


const enableinput = () => {
    for (let box of board) {
        box.disabled = false;
        box.innerText = "";
    }
}

const checkWinner = () => {
    for (let pattern of winnerPatterns) {
        let p1 = board[pattern[0]].innerText;
        let p2 = board[pattern[1]].innerText;
        let p3 = board[pattern[2]].innerText;

        if (p1 !== "" && p2 !== "" && p3 !== "") {
            if (p1 === p2 && p2 === p3) {
                printWinner(p1);
                disableinput();
                return;
            }
        }
    }

    let isBoardFull = true;
    for (let box of board) {
        if (box.innerText === "") {
            isBoardFull = false;
            break;
        }
    }

    if (isBoardFull) {
        printDraw();
        disableinput();
    }
}

board.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O";
            box.style.color = "#1f51ff";
            turn.innerText = "Player X's turn";
            turn.style.color = "#ff5333";
            turnO = false;
        } else {
            box.innerText = "X";
            box.style.color = "#ff5333";
            turn.innerText = "Player O's turn";
            turn.style.color = "#1f51ff";
            turnO = true;
        }
        box.disabled = true;
        checkWinner();
    });
});

newBtn.addEventListener("click", newGame);
rstBtn.addEventListener("click", resetGame);
