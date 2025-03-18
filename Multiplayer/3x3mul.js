const socket = io();

let playerSymbol = "";
let turn = "X"; 
let board = document.querySelectorAll(".box");
let statusText = document.getElementById("status");

socket.on("playerType", (symbol) => {
    playerSymbol = symbol;
    statusText.innerText = `You are Player ${playerSymbol}`;
});

socket.on("full", () => {
    alert("Game is full! Try again later.");
});

socket.on("updateBoard", ({ boardState, currentTurn }) => {
    turn = currentTurn;
    board.forEach((box, index) => {
        box.innerText = boardState[index];
    });
    statusText.innerText = `Player ${turn}'s turn`;
});

board.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (playerSymbol === turn && box.innerText === "") {
            socket.emit("move", { index, player: playerSymbol });
        }
    });
});

socket.on("resetGame", () => {
    board.forEach((box) => (box.innerText = ""));
    statusText.innerText = "Waiting for opponent...";
});

document.getElementById("reset").addEventListener("click", () => {
    socket.emit("resetGame");
});
