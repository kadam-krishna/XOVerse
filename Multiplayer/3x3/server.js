const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let waitingPlayer = [];
let games = [];

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
    waitingPlayer.push(ws);

    if (waitingPlayer.length >= 2) {
        const playerX = waitingPlayer.shift();
        const playerO = waitingPlayer.shift();
        const game = {
            players: [playerX, playerO],
            board: Array(9).fill(null),
            currentPlayer: Math.random() > 0.5 ? playerX : playerO,
            winner: null,
            gameOver: false,
        };

        games.push(game);
        game.players.forEach(player => player.send(JSON.stringify({
            type: 'start',
            currentPlayer: game.currentPlayer === player
        })));
    }

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const game = games.find(g => g.players.includes(ws));

        if (data.type === 'move' && game && !game.gameOver) {
            if (game.currentPlayer === ws && game.board[data.index] === null) {
                game.board[data.index] = game.currentPlayer === game.players[0] ? 'X' : 'O';
                game.currentPlayer = game.currentPlayer === game.players[0] ? game.players[1] : game.players[0];

                game.players.forEach(player => player.send(JSON.stringify({
                    type: 'move',
                    board: game.board,
                    currentPlayer: game.currentPlayer === player
                })));

                checkWinner(game);
            }
        } else if (data.type === 'restart' && game) {
            game.board = Array(9).fill(null);
            game.currentPlayer = Math.random() > 0.5 ? game.players[0] : game.players[1];
            game.winner = null;
            game.gameOver = false;

            game.players.forEach(player => player.send(JSON.stringify({
                type: 'restart',
                board: game.board,
                currentPlayer: game.currentPlayer === player
            })));
        }
    });

    ws.on('close', () => {
        const game = games.find(g => g.players.includes(ws));

        if (game) {
            const opponent = game.players.find(player => player !== ws);
            if (opponent) {
                opponent.send(JSON.stringify({ type: 'disconnect' }));
            }
            games = games.filter(g => g !== game);
            waitingPlayer = waitingPlayer.filter(player => player !== ws);
        }
    });
});

function checkWinner(game) {
    const winnerPatterns = [
        [0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7],
        [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8],
    ];

    for (let pattern of winnerPatterns) {
        const [a, b, c] = pattern;
        if (game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c]) {
            game.winner = game.board[a];
            game.gameOver = true;

            game.players.forEach(player => player.send(JSON.stringify({
                type: 'win',
                winner: game.winner
            })));
            return;
        }
    }

    if (game.board.every(cell => cell !== null)) {
        game.gameOver = true;
        game.players.forEach(player => player.send(JSON.stringify({
            type: 'draw'
        })));
    }
}

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
