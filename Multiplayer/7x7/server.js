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
            board: Array(49).fill(null),
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
            game.board = Array(49).fill(null);
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

    for (let pattern of winnerPatterns) {
        const [a, b, c,d,e] = pattern;
        if (game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c] && game.board[a] === game.board[d] && game.board[a] === game.board[e]) {
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
