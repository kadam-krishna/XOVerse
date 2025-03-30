const search = document.getElementById('search');
const board = document.getElementById('board');
const message = document.getElementById('message');
const turn = document.getElementById('turn');
const restart = document.getElementById('reset');
const cells = document.querySelectorAll('.cell');

let ws;
let currentPlayer = null;
let gameOver = false;
let chance='';
search.addEventListener('click', () => {
    if (ws) {
        ws.close();
    }
    ws = new WebSocket('ws://localhost:3000'); 
    // ws = new WebSocket('https://xoverse3x3.onrender.com'); 

    clearBoard();
    message.textContent = 'Waiting for Opponent...';
    turn.textContent = '';
    restart.style.display = 'none';
    gameOver = false;

    ws.onopen = () => {
        board.style.display = 'none';
    };

    ws.onmessage = (event) => {
        search.style.display='none';
        const data = JSON.parse(event.data);
        chance=data.chance;
        if (data.type === 'start') {
            currentPlayer = data.currentPlayer;
            turn.textContent = currentPlayer ?`Your Turn (${chance})` : `Opponent's Turn (${chance})`;
            
            message.textContent = '';
            chance=data.chance;
            board.style.display = 'grid';
        } else if (data.type === 'move') {
            updateBoard(data.board);
            currentPlayer = data.currentPlayer;
            chance= chance=='X'?'O':'X';
            turn.textContent = currentPlayer ? `Your Turn (${chance})` : `Opponent's Turn (${chance})`;
        } else if (data.type === 'win') {
            message.textContent = `Player ${data.winner} wins!`;
            turn.style.display='none'
            gameOver = true;
            disableBoard();
            restart.style.display = 'block';
        } else if (data.type === 'restart') {
            currentPlayer = data.currentPlayer;
            search.style.display='none';
            turn.style.display='block';
            turn.textContent = currentPlayer ? `Your Turn (${data.chance})` : `Opponent's turn (${data.chance})`;
            message.textContent = '';
            gameOver = false;
            restart.style.display = 'none';
            enableBoard();
            updateBoard(Array(25).fill(null));
        } else if (data.type === 'disconnect') { 
            setTimeout(function(){
                alert("Opponent disconnected");
                window.location.reload();
            }, 2000);
            gameOver = true;
            disableBoard();
            restart.style.display = 'inline-block';
        }
    };

    ws.onclose = () => {
        message.textContent = 'Disconnected. Click "Player Search" to find a new opponent';
        setTimeout(function(){
            window.location.reload();
        }, 2000);
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
        cells.forEach((cell,index)=>{
            cell.style.color= (boardState[index] === 'O') ? "#1f51ff" : "#ff3333";
        });
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
