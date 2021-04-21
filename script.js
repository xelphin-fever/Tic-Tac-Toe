


//---GAME BOARD---
const gameBoard = (() => {
    //Initialize Board
    let myBoard = {
        board: ["-","-","-","-","-","-","-","-","-"],
        boardSplit:[
            ["","",""],
            ["","",""],
            ["","",""]
        ],
        boardTest: [
            ["","",""],
            ["","",""],
            ["","",""]
        ],
    }
    //LOG BOARD IN CONSOLE
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

    //CHECK IF POSITION AVAILABLE
    const checkAvailable = (position) => {
        if (myBoard.board[position]!="-"){
            return false;
        }
        return true;
    }
    //ADD MOVE TO REAL BOARDS
    const addToBoard = (position,sign) => {
        myBoard.board[position]=sign;
        myBoard.boardSplit[Math.floor(position/3)][position%3]=sign;
        myBoard.boardTest=myBoard.boardSplit; //safer because of manipulations
    }

    //TEST
    //Test Move on Board
    const addToBoardTest = (position, sign) => {
        console.log("added to board test at: ",position);
        myBoard.boardTest[Math.floor(position/3)][position%3]=sign;
    }
    //Remove Test Move from Board
    const removeFromBoardTest = (position) => {
        myBoard.boardTest[Math.floor(position/3)][position%3]="";
    }
    //Get Test Board
    const getTestBoard = () => myBoard.boardTest;

    
    //CHECK FOR WIN
    const checkWin = (sign, checkBoard=myBoard.boardSplit) => {
        //check horizontal
        for (let i=0;i<3;i++){
            if (checkBoard[i][0]==sign &&checkBoard[i][1]==sign && checkBoard[i][2]==sign){
                return true;
            }
        }
        //check vertical
        for (let i=0; i<3;i++){
            if (checkBoard[0][i]==sign && checkBoard[1][i]==sign && checkBoard[2][i]==sign){
                return true;
            }
        }
        //check diagonal
        if (checkBoard[0][0]==sign && checkBoard[1][1]==sign && checkBoard[2][2]==sign){
            return true;
        }
        if (checkBoard[0][2]==sign && checkBoard[1][1]==sign && checkBoard[2][0]==sign){
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
        myBoard.boardTest = [
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
        addToBoardTest,
        removeFromBoardTest,
        getTestBoard,
    }
})();

//---PLAYER---
const Player = (name, sign,position) => {
    let wins = 0;

    const getName = () => name;
    const getSign = () => sign;
    const addWin = () => wins++;
    const getScore= () => wins;
    const getPosition = () => position;

    return {
        getName,
        getSign,
        addWin,
        getScore,
        getPosition,
    }
}

//---DOM---
const displayController = (() => {
    //Title
    const titleGame = document.querySelector("#title");
    const titleWinner = document.querySelector("#winner");
    const spanWinner = document.querySelector("#winner-span");
    //Player Titles
    const titlePlayer1 = document.querySelector("#player1-title");
    const titlePlayer2 = document.querySelector("#player2-title");
    //Reset
    const btnReset = document.querySelector("#btn-reset");
    //Log
    const logPlayer = document.querySelector("#player-span");
    const logScore1 = document.querySelector("#score1-span");
    const logScore2 = document.querySelector("#score2-span");
    //Stars
    const divStarsPlayer1 = document.querySelector("#div-player1-stars");
    const divStarsPlayer2 = document.querySelector("#div-player2-stars");
    //Squares
    const squares = document.querySelectorAll(".div-square");
    //Computer Button
    const computerButton = document.querySelector("#btn-comp");
    const computerSpan = document.querySelector("#span-comp");

    let hasReset=false;
    let playComputer=false;

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
        //UPDATE LOG
        (player==1) ? logPlayer.textContent="Player 1" : logPlayer.textContent="Player 2";
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
        changeTitle(false);
        if (playComputer==true && game.getCurrentPlayer().getPosition()=="2"){
            game.addMoveComputer();
        }
    });
    const getReset = () => hasReset;
    const falsifyReset =() => {
        hasReset=false;
        console.log("New Game:");
    };

    //LOG SCORE
    const updateLogScore= (player,position) => {
        (position=="1") ? logScore1.textContent=`${player.getScore()}` : logScore2.textContent=`${player.getScore()}`;
    }

    //CHANGE TITLE
    const changeTitle = (showWinner,winner="0") => {
        if (showWinner==true){
            titleGame.style.display="none";
            titleWinner.style.display="block";
            spanWinner.textContent = winner;
        }
        else {
            titleWinner.style.display="none";
            titleGame.style.display="block";
        }
    }

    //PLAY COMPUTER
    const getPlayComputer = () => playComputer;
    computerButton.addEventListener("click", () => {
        playComputer= !playComputer;
        if (playComputer==true){
            computerSpan.textContent="Computer";
        }
        else {
            computerSpan.textContent="Person";
        }
        //if switch after player 1 did turn
        if (game.getCurrentPlayer().getPosition()=="2"){
            game.addMoveComputer();
        }
    })

    return  {
        addSignToSquare,
        addStar,
        getReset,
        falsifyReset,
        playerTurn,
        updateLogScore,
        changeTitle,
        getPlayComputer,
    }

})();


//--COMPUTER---
const computer = (() => {

    const mySign = "O";
    const oppSign ="X";

    //RANDOM MOVE
    const randomMove = () => {
        let availablePlaces=[];
        for (let i=0;i<9;i++){
            if (gameBoard.checkAvailable(i.toString())){
                availablePlaces.push(i.toString());
            }
        }
        let randomPlace = availablePlaces[Math.floor(Math.random() * availablePlaces.length)]
        return randomPlace;
    }

    //SMART MOVE
    //
    //if only one move left, go there
    //if nothing put yet, put in middle
    //computer checks if have a win if put O somewhere, then do it
    //computer checks if person has a win if put X somewhere, then block it
    //put randomly ? oooor recursion??
    let hasWon=false;
    const smartMove = (checkBoard= gameBoard.getTestBoard()) => {
        console.log("Computer Think of Move:");
        console.log("Current Board Before Move: ",checkBoard);
        let availablePlaces=[];
        for (let i=0;i<9;i++){
            if (gameBoard.checkAvailable(i.toString())){
                availablePlaces.push(i.toString());
            }
        }
        //only one available place
        if (availablePlaces.length==1){
            console.log("Computer Places in Middle to Start")
            return availablePlaces[0];
        }
        //it's the first move or second move and the middle isn't taken
        if (availablePlaces.length==9 || (availablePlaces.length==8 && availablePlaces.includes("4"))){
            return "4";
        }
        if (availablePlaces.length==8){
            return "0";
        }
        //test for a win
        for (let i=0;i<availablePlaces.length;i++){
            gameBoard.addToBoardTest(availablePlaces[i], mySign);
            let myWin = gameBoard.checkWin(mySign,checkBoard);
            if (myWin==true){
                hasWon=true;
                console.log("Computer Places for Win");
                return availablePlaces[i];
            }
            gameBoard.removeFromBoardTest(availablePlaces[i]);
        }
        //test for opponent win
        for (let j=0;j<availablePlaces.length;j++){
            gameBoard.addToBoardTest(availablePlaces[j], oppSign);
            let oppWin = gameBoard.checkWin(oppSign,checkBoard);
            if (oppWin==true){
                console.log("Computer Places for Block");
                return availablePlaces[j];
            }
            gameBoard.removeFromBoardTest(availablePlaces[j]);
        }
        //put in conrners if available
        if (availablePlaces.includes("2")){
            return "2";
        }
        if (availablePlaces.includes("6")){
            return "6";
        }
        if (availablePlaces.includes("8")){
            return "8";
        }

        //put randomly
        console.log("Computer at Random");
        let randomPlace = availablePlaces[Math.floor(Math.random() * availablePlaces.length)]
        return randomPlace;
    }



    //RETURN
    return {
        randomMove,
        smartMove,
    }
})();

//---GAME---
const game = ( () => {
    console.log("Start Game:");

    const player1 = Player("player1","X","1");
    const player2 = Player("player2","O","2");

    let currentPlayer =player1;
    let stopGame = false;

    const addMove = (position) => {
        //RESET
        if (displayController.getReset()==true){
            displayController.falsifyReset();
            stopGame=false;
        }
        //PERSON MOVE
        if (gameBoard.checkAvailable(position) && stopGame==false){
            gameBoard.addToBoard(position,currentPlayer.getSign());
            displayController.addSignToSquare(position,currentPlayer.getSign());
            (currentPlayer==player1) ? displayController.playerTurn("2") : displayController.playerTurn("1");
            if (gameBoard.checkWin(currentPlayer.getSign())){
                console.log(currentPlayer.getName()+" is the Winner!");
                stopGame=true;
                currentPlayer.addWin();
                displayController.addStar(currentPlayer.getPosition());
                displayController.updateLogScore(currentPlayer,currentPlayer.getPosition());
                displayController.changeTitle(true,currentPlayer.getPosition());
                 
            }
            else if (gameBoard.checkTie()){
                console.log("We have a tie.")
                stopGame=true;
            }
            (currentPlayer==player1) ? currentPlayer=player2 : currentPlayer= player1;
            //COMPUTER MOVE
            if (currentPlayer==player2 && displayController.getPlayComputer()==true && stopGame==false){
                console.log("computer move");
                addMoveComputer();
            }
            //PRINT BOARD TO CONSOLE
            gameBoard.printBoard();

        }
        else if (stopGame==false){
            console.log("position taken");
        }
    }

    const addMoveComputer = () => {
        let computerMove = computer.smartMove();
        console.log("Computer Chose Move: ",computerMove);
        addMove(computerMove);
    }

    const getCurrentPlayer = () => currentPlayer;
    const isGameOver = () => stopGame;
    
    return {
        addMove,
        addMoveComputer,
        getCurrentPlayer,
        isGameOver,
    }
})();


//
//

