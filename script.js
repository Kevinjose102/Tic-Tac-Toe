//state of the game board
function GameBoard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const changeCell = (row, column, player) => {
        if(board[row][column].getValue() === 0){
            board[row][column].addToken(player)
        }
    }

    //to print the board on the console
    const printBoard = () => {
        const boardValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardValues)
    }

    return{getBoard, changeCell, printBoard}
}

//cell is one square on the board 
//intiial value being 0 and player 1 : 1 and player 2 : 2
//that is if they choose to select a particular cell and change it to their value during their turn
function Cell(){
    let value = 0;
    
    //to change the value of a particular cell when the user interacts
    const addToken = (player) => {
        value = player;
    };

    //to get the value of a particular cell
    const getValue = () => value;

    return{
        addToken, getValue
    };
}

//the flow of the game
//decides the current activer player starting initially from player 1
//players are stored in a seperate array players as objects with their name and the token value (1/2)
function GameFlow(
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
){
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ]

    let activePlayer = players[0]

    //should be called after the playround() to switch the player 
    const switchTurn = () => {
        if(activePlayer === players[0]){
            activePlayer = players[1];
        }
        else{
            activePlayer = players[0]
        }
    }

    const getActivePlayer = () => activePlayer;

    //should be called after each round or after each players turn so that the new state of the board
    //is displayed on the console
    const printNewRound = () => {
        board.printBoard();
        console.log(getActivePlayer().name + "'s turn")
    };

    //when the current activeplayer is done with his turn
    //the value should be changed in the gameboard and the new board should be printed
    //also the player has to be switched now changing the active player
    const playRound = (row, column) => {
        console.log("adding the" + getActivePlayer().name + "value to" + row + " " + column)
        board.changeCell(row, column, getActivePlayer().token)

        //flag will remain 0 if the active player has won
        //else will change to 1
        let won = true;
    
        // Check row
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[row][i].getValue() !== getActivePlayer().token) {
                won = false;
                break;
            }
        }
    
        // Check column
        if (!won) { 
            won = true;
            for (let i = 0; i < 3; i++) {
                if (board.getBoard()[i][column].getValue() !== getActivePlayer().token) {
                    won = false;
                    break;
                }
            }
        }
    
        // Check diagonals if row and column are on a diagonal
        if (!won && row === column) {
            won = true;
            for (let i = 0; i < 3; i++) {
                if (board.getBoard()[i][i].getValue() !== getActivePlayer().token) {
                    won = false;
                    break;
                }
            }
        }
    
        if (!won && row + column === 2) {
            won = true;
            for (let i = 0; i < 3; i++) {
                if (board.getBoard()[i][2 - i].getValue() !== getActivePlayer().token) {
                    won = false;
                    break;
                }
            }
        }
    
        if (won) {
            console.log(getActivePlayer().name + " won the round");
        } else {
            switchTurn();
            printNewRound();
        }
    }
    return {playRound, getActivePlayer, getBoard: board.getBoard}
    
}

function Screen() {
    const game = GameFlow();
    const playerTurn = document.querySelector(".turn")
    const boardDiv = document.querySelector(".board")

    const updateScreen = () => {
        boardDiv.textContent = "";
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurn.textContent = `${activePlayer.name}'s turn..`

        //for the buttons on the board
        board.forEach((row, indexRow) => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button")
                cellButton.classList.add("cell")
                cellButton.dataset.column = index
                cellButton.dataset.row = indexRow
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }


function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    if(!selectedColumn || !selectedRow) return;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
}

boardDiv.addEventListener("click", clickHandlerBoard);
updateScreen();
}

Screen();