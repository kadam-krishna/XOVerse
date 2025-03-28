const search = document.getElementById('search');
const board = document.getElementById('board');
const message = document.getElementById('message');
const turn = document.getElementById('turn');
const restart = document.getElementById('reset');
const cells = document.querySelectorAll('.cell');

let ws;
let currentPlayer = null;
let gameOver = false;

search.addEventListener('click', () => {
    if (ws) {
        ws.close();
    }
    ws = new WebSocket('ws://localhost:3000'); 

    clearBoard();
    message.textContent = 'Waiting for Opponent...';
    turn.textContent = '';
    restart.style.display = 'none';
    gameOver = false;

    ws.onopen = () => {
        board.style.display = 'none';
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'start') {
            currentPlayer = data.currentPlayer;
            turn.textContent = currentPlayer ? 'Your Turn' : "Opponent's turn";
            message.textContent = '';
            board.style.display = 'grid';
            search.style.display='none';
        } else if (data.type === 'move') {
            updateBoard(data.board);
            currentPlayer = data.currentPlayer;
            turn.textContent = currentPlayer ? 'Your Turn' : "Opponent's turn";
        } else if (data.type === 'win') {
            message.textContent = `Player ${data.winner} wins!`;
            gameOver = true;
            disableBoard();
            restart.style.display = 'inline-block';
        } else if (data.type === 'restart') {
            currentPlayer = data.currentPlayer;
            turn.textContent = currentPlayer ? 'Your Turn' : "Opponent's turn";
            message.textContent = '';
            gameOver = false;
            restart.style.display = 'none';
            enableBoard();
            updateBoard(Array(9).fill(null));
        } else if (data.type === 'disconnect') { // Fixed spelling mistake
            message.textContent = 'Opponent disconnected';
            gameOver = true;
            disableBoard();
            board.style.display='none';
            search.style.display='inline-block';
            restart.style.display = 'inline-block';
        }
    };

    ws.onclose = () => {
        message.textContent = 'Disconnected. Click "Player Search" to find a new opponent';
        gameOver = true;
        disableBoard();
        restart.style.display = 'none';
        search.style.display = 'inline-block';
    };
});


cells.forEach(cell =>{
    cell.addEventListener('click',()=>{
        if(currentPlayer && cell.textContent === '' && !gameOver){
            const index = cell.dataset.index;
            ws.send(JSON.stringify({type:'move',index}));
        }
    })
});

restart.addEventListener('click',()=>{
    ws.send(JSON.stringify({type:'restart'}));
});

function updateBoard(boardState){
    cells.forEach((cell,index)=>{
        cell.textContent=boardState[index];
    });
}

function disableBoard(){
    cells.forEach(cell=>{
        cell.removeEventListener('click',()=>{});
    });
}
function enableBoard(){
    cells.forEach((cell,index)=>{
        cell.addEventListener('click',()=>{
            if(currentPlayer && cell.textContent === '' && !gameOver){
                const index = cell.dataset.index;
                ws.send(JSON.stringify({type:'move',index}));
            }
        });
    });
}
function clearBoard(){
    cells.forEach(cell=>{
        cell.textContent='';
    });
}
