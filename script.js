


//---GAME BOARD---
const gameBoard = (() => {
    //Initialize Board
    let myBoard = {
        board: ["-","-","-","-","-","-","-","-","-"],
        boardSplit:[["","",""],
            ["","",""],
            ["","",""]
        ]
    }
    //Log Board in Console
    const printBoard = () => {
        let boardString="";
        for (let i=0; i<3 ; i++){
            for (let j=0; j<3; j++){
                boardString+=myBoard.board[(i*3)+j]+" ";
            }
            boardString+="\n";
        }
        console.log(boardString);
    }
    //Check if Position Available
    const checkAvailable = (position) => {
        if (myBoard.board[position]!="-"){
            return false;
        }
        return true;
    }
    //Add Move to Board
    const addToBoard = (position,sign) => {
        myBoard.board[position]=sign;
        myBoard.boardSplit[Math.floor(position/3)][position%3]=sign;
    }
    //Check For Win
    const checkWin = (sign) => {
        //check horizontal
        for (let i=0;i<3;i++){
            if (myBoard.boardSplit[i][0]==sign && myBoard.boardSplit[i][1]==sign && myBoard.boardSplit[i][2]==sign){
                return true;
            }
        }
        //check vertical
        for (let i=0; i<3;i++){
            if (myBoard.boardSplit[0][i]==sign && myBoard.boardSplit[1][i]==sign && myBoard.boardSplit[2][i]==sign){
                return true;
            }
        }
        //check diagonal
        if (myBoard.boardSplit[0][0]==sign && myBoard.boardSplit[1][1]==sign && myBoard.boardSplit[2][2]==sign){
            return true;
        }
        if (myBoard.boardSplit[0][2]==sign && myBoard.boardSplit[1][1]==sign && myBoard.boardSplit[2][0]==sign){
            return true;
        }
        //no win
        return false;
    }
    //CHECK TIE
    const checkTie = () => {
        for (let i=0; i<myBoard.board.length;i++){
            if (myBoard.board[i]=="-"){
                return false;
            }
        }
        return true;
    }
    //RESET
    const resetBoard = () => {
        myBoard.board= ["-","-","-","-","-","-","-","-","-"];
        myBoard.boardSplit =  [
            ["","",""],
            ["","",""],
            ["","",""]
        ]
    }
    //
    //
    return {
        printBoard,
        checkAvailable,
        addToBoard,
        checkWin,
        checkTie,
        resetBoard,
    }
})();

//---PLAYER---
const Player = (name, sign) => {
    let wins = 0;

    const getName = () => name;
    const getSign = () => sign;
    const addWin = () => wins++;
    const getScore= () => wins;

    return {
        getName,
        getSign,
        addWin,
        getScore,
    }
}

//---DOM---
const displayController = (() => {
    const squares = document.querySelectorAll(".div-square");
    const titlePlayer1 = document.querySelector("#player1-title");
    const titlePlayer2 = document.querySelector("#player2-title");
    const divStarsPlayer1 = document.querySelector("#div-player1-stars");
    const divStarsPlayer2 = document.querySelector("#div-player2-stars");
    const btnReset = document.querySelector("#btn-reset");

    let hasReset=false;

    //SQUARES
    squares.forEach((square) => {
        square.addEventListener('click', () => {
            console.log("clicked square ", square.getAttribute("data-square"));
            let squarePosition = square.getAttribute("data-square");
            game.addMove(squarePosition);
        });
    });
    const addSignToSquare = (position,sign) => {
        let mySquare =document.querySelector(`[data-square='${position}']`);
        mySquare.textContent = sign;
    }

    //PLAYER TURN (BORDER)
    const playerTurn = (player) => {
        if (player=="1"){
            titlePlayer1.style.border="3px solid #e4c583d8";
            titlePlayer2.style.border="none";
        }
        else{
            titlePlayer1.style.border="none";
            titlePlayer2.style.border="3px solid #e4c583d8";
        }
    }

    //ADD STAR
    const addStar = (winner) => {
        console.log("sent winner number: ", winner);
        (winner==1) ? divStarsPlayer1.appendChild(createStar()) : divStarsPlayer2.appendChild(createStar());
    }
    const createStar = () => {
        const starDiv = document.createElement("div");
        const star = document.createElement("i");
        star.classList.add("fa");
        star.classList.add("fa-star");
        star.classList.add("fa-4x");
        starDiv.appendChild(star);
        return starDiv;
    }
    //RESET
    btnReset.addEventListener("click", () => {
        squares.forEach((square) => {
            square.textContent = "";
        });
        gameBoard.resetBoard();
        hasReset=true;
    });
    const getReset = () => hasReset;
    const falsifyReset =() => {
        hasReset=false;
        console.log("New Game:");
    };


    return  {
        addSignToSquare,
        addStar,
        getReset,
        falsifyReset,
        playerTurn,
    }

})();



//---GAME---
const game = ( () => {
    console.log("Start Game:");

    const player1 = Player("player1","X");
    const player2 = Player("player2","O");

    let currentPlayer =player1;
    let stopGame = false;

    const addMove = (position) => {
        if (displayController.getReset()==true){
            displayController.falsifyReset();
            stopGame=false;
        }
        if (gameBoard.checkAvailable(position) && stopGame==false){
            gameBoard.addToBoard(position,currentPlayer.getSign());
            displayController.addSignToSquare(position,currentPlayer.getSign());
            (currentPlayer==player1) ? displayController.playerTurn("2") : displayController.playerTurn("1");
            if (gameBoard.checkWin(currentPlayer.getSign())){
                console.log(currentPlayer.getName()+" is the Winner!");
                stopGame=true;
                currentPlayer.addWin();
                (currentPlayer==player1) ? displayController.addStar("1") : displayController.addStar("2");
            }
            else if (gameBoard.checkTie()){
                console.log("We have a tie.")
                stopGame=true;
            }
            (currentPlayer==player1) ? currentPlayer=player2 : currentPlayer= player1;
            gameBoard.printBoard();
        }
        else if (stopGame==false){
            console.log("position taken");
        }
    }
    return {
        addMove,
    }
})();


//
//

