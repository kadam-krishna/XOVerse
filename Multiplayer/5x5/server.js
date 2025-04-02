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
        let x=Math.random();
        const game = {
            players: [playerX, playerO],
            board: Array(25).fill(null),
            currentPlayer: x > 0.5 ? playerX : playerO,
            winner: null,
            gameOver: false,
            chance:'',
        };

        games.push(game);
        game.players.forEach(player => player.send(JSON.stringify({
            type: 'start',
            currentPlayer: game.currentPlayer === player,
            chance:x > 0.5?'X':'O',
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
                    chance: game.currentPlayer === game.players[0] ? 'O' : 'X',
                    currentPlayer: game.currentPlayer === player,
                })));

                checkWinner(game);
            }
        } else if (data.type === 'restart' && game) {
            game.board = Array(25).fill(null);
            let y=Math.random();
            game.currentPlayer = y> 0.5 ? game.players[0] : game.players[1];
            game.winner = null;
            game.gameOver = false;

            game.players.forEach(player => player.send(JSON.stringify({
                type: 'restart',
                board: game.board,
                currentPlayer: game.currentPlayer === player,
                chance:y > 0.5?'X':'O',
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
      

    for (let pattern of winnerPatterns) {
        const [a, b, c,d] = pattern;
        if (game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c] && game.board[a] === game.board[d]) {
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
