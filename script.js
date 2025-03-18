function showRules(boardSize) {
    const rulesText = {
        '3x3': '3x3 Board: First to get 3 in a row wins.',
        '5x5': '5x5 Board: First to get 4 in a row wins.',
        '7x7': '7x7 Board: First to get 5 in a row wins.'
    };
    
    document.getElementById("rules-text").innerText = rulesText[boardSize];
}
    