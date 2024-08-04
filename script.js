document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const cells = document.querySelectorAll('.cell');
    const resultMessage = document.getElementById('resultMessage');
    const restartButton = document.getElementById('restartButton');
    const aiThinking = document.getElementById('aiThinking');
    let currentPlayer = 'X'; // Human player starts as 'X'
    let gameState = Array(9).fill(null);

    function handleCellClick(event) {
        const cellIndex = event.target.getAttribute('data-cell-index');
        if (!gameState[cellIndex] && currentPlayer === 'X') { // Human player move
            gameState[cellIndex] = currentPlayer;
            event.target.classList.add(currentPlayer);
            event.target.textContent = currentPlayer;
            if (checkWin(currentPlayer)) {
                resultMessage.textContent = `${currentPlayer} wins!`;
                flashWinningCells();
                gameBoard.removeEventListener('click', handleCellClick);
                return;
            } else if (gameState.every(cell => cell !== null)) {
                resultMessage.textContent = 'Draw!';
                return;
            }
            currentPlayer = 'O'; // Switch to AI
            aiThinking.style.display = 'block';
            setTimeout(() => {
                aiMove();
                aiThinking.style.display = 'none';
                if (checkWin('O')) {
                    resultMessage.textContent = 'O wins!';
                    flashWinningCells();
                    gameBoard.removeEventListener('click', handleCellClick);
                } else if (gameState.every(cell => cell !== null)) {
                    resultMessage.textContent = 'Draw!';
                } else {
                    currentPlayer = 'X'; // Switch back to Human
                }
            }, 1000);
        }
    }

    function aiMove() {
        const bestMove = minimax(gameState, 'O').index;
        gameState[bestMove] = 'O';
        const aiCell = cells[bestMove];
        aiCell.classList.add('O');
        aiCell.textContent = 'O';
    }

    function checkWin(player) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winningCombinations.some(combination => 
            combination.every(index => gameState[index] === player)
        );
    }

    function flashWinningCells() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let combination of winningCombinations) {
            if (combination.every(index => gameState[index] === currentPlayer)) {
                combination.forEach(index => {
                    cells[index].classList.add('flash');
                });
            }
        }
    }

    function minimax(newBoard, player) {
        const availSpots = newBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);

        if (checkWin('X')) return { score: -10 };
        if (checkWin('O')) return { score: 10 };
        if (availSpots.length === 0) return { score: 0 };

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'O') {
                move.score = minimax(newBoard, 'X').score;
            } else {
                move.score = minimax(newBoard, 'O').score;
            }

            newBoard[availSpots[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

    function restartGame() {
        gameState.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O', 'flash');
            cell.addEventListener('click', handleCellClick);
        });
        resultMessage.textContent = '';
        currentPlayer = 'X'; // Human player starts
    }

    gameBoard.addEventListener('click', handleCellClick);
    restartButton.addEventListener('click', restartGame);

    restartGame();
});
