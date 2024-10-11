let globalWon = false;

//these global variables are only required for the HTML/CSS part of it
//the game should "function" without these too 

let playerone;
let playertwo;

const dialogOne = document.querySelector(".playerone")
const dialogTwo = document.querySelector(".playertwo")
const nextButton = document.querySelector(".next")
const submitButton = document.querySelector(".submit")
const cancelButtons = document.querySelectorAll(".cancel")
const playButton = document.querySelector(".play")

//inputs from the user
const player1name = document.querySelector(".name1")
const player2name = document.querySelector(".name2")
const error = document.querySelectorAll(".error")

const body = document.querySelector("body")

playButton.addEventListener("click", () => {
    dialogOne.showModal();
    globalWon = false
    result.textContent = ""
    nextButton.value = "next"
})

cancelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        dialogOne.close();
        dialogTwo.close();
    })
})

nextButton.addEventListener("click", () => {
    if(player1name.value == ""){
        error[0].textContent = "*this is a required field"
    }
    else{
        playerone = player1name.value
        dialogOne.close();
        dialogTwo.showModal();
    }
})

submitButton.addEventListener("click", () => {
    if(player2name.value == ""){
        error[1].textContent = "*this is a required field"
    }
    else{
        playertwo = player2name.value
        dialogTwo.close();
        playButton.textContent = "RESET"
        //creating the grid
        const createBoard = document.createElement("div");
        createBoard.classList.add("board")

        const createTurn = document.createElement("div")
        createTurn.classList.add("turn")

        const createResult = document.createElement("div")
        createResult.classList.add("result")
        body.appendChild(createTurn)
        body.appendChild(createBoard)
        body.appendChild(createResult)
        Screen();
    }
})

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
        //console.log(boardValues)
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
    playerOneName = playerone,
    playerTwoName = playertwo
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
    const switchTurn = (won) => {
        if(!won){
            if(activePlayer === players[0]){
                activePlayer = players[1];
            }
            else{
                activePlayer = players[0]
            }
        }
        else{
            return;
        }
    }

    const getActivePlayer = () => activePlayer;

    //should be called after each round or after each players turn so that the new state of the board
    //is displayed on the console
    const printNewRound = (won) => {
        if(!won){
            board.printBoard();
        }
        else{
            return;
        }
    };

    //when the current activeplayer is done with his turn
    //the value should be changed in the gameboard and the new board should be printed
    //also the player has to be switched now changing the active player
    const playRound = (row, column) => {
        if(board.getBoard()[row][column].getValue() == 0){
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
        
            if (!won){
                won = true;
                for (let i = 0; i < 3; i++) {
                    if (board.getBoard()[i][2 - i].getValue() !== getActivePlayer().token) {
                        won = false;
                        break;
                    }
                }
            }
        
            if (won) {
                //should stop the game
                switchTurn(won);
                printNewRound(won);
                globalWon = true;
                const result = document.querySelector(".result")
                result.textContent = getActivePlayer().name +  " won the round"
                playButton.textContent = "PLAY"
                return;
            } else {
                switchTurn(won);
                printNewRound(won);
            }
        }
    }
    return {playRound, getActivePlayer, getBoard: board.getBoard}
    
}

function Screen() {
    const game = GameFlow();

    const boardDiv = document.querySelector(".board")

    const updateScreen = () => {
        boardDiv.textContent = "";
        const board = game.getBoard();
        const playerTurn = document.querySelector(".turn")
        const activePlayer = game.getActivePlayer();

        playerTurn.textContent = `${activePlayer.name}'s turn..`

        //for the buttons on the board
        board.forEach((row, indexRow) => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button")
                cellButton.classList.add("cell")
                cellButton.dataset.column = index
                cellButton.dataset.row = indexRow

                if(cell.getValue() == 1){
                    cellButton.textContent = "X"
                }
                else if(cell.getValue() == 2){
                    cellButton.textContent = "O"
                }
                boardDiv.appendChild(cellButton);
            })
        })
    }


function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    if(!selectedColumn || !selectedRow) return;
    if(!globalWon){
        game.playRound(selectedRow, selectedColumn);
    }
    updateScreen();
}

boardDiv.addEventListener("click", clickHandlerBoard);
updateScreen();
}