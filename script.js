//Start the game but get the value from user input
function gameStart() {
    let player = document.getElementById("player").value
    let row = document.getElementById("row").value
    let column = document.getElementById("column").value

    let start = new Game(column,row,player)
    start.createPlayer()
    start.createBoard()
    start.setBoardSpecialMove()

    document.getElementById("diceRollBtn").addEventListener("click",() => {
        start.diceRoll()
    })
    
    //Hide setting
    document.getElementById("setting").classList.toggle("hidden")
    document.getElementById("playing").classList.toggle("hidden")
    document.getElementById("snake").classList.toggle("hidden")
    document.getElementById("mainContainer").classList.toggle("fixScreen")
}

class Game {

    //Create game get column, row of board and player's amount from input
    constructor(col,row,players) {
        this.column = col
        this.row = row
        this.players = players
        this.area = col*row
    }
    //Set turn of player
    //Set array of player to store player properties start at index 0 = player 0 (but will show in UI player's display = player index + 1)
    //Set array of board to store board properties 
    //Set counter to count the turn
        turn = 0
        player = []
        board = []
        counter = 1

    //Use for loop to create and put each player properties to player array by follow input player amount
    createPlayer() {
        let createTurn = document.getElementById("turn")
        for(let i=0 ; i < this.players; i++) {
            this.player[i] = new Player(i)

            createTurn.innerHTML = createTurn.innerHTML + `<div id="player${i}" class="playerTurnDisplay"><img src="Image/player${i+1}.svg"/><p>Player ${i+1}</p></div>`

            //Set starter player in UI
            if (i==0) {
                document.getElementById("player0").classList.add("playTurnActive")
            }
        }
    }

    //Use for for loop to create and put each board square properties to board array by follow input column and row
    //Use 2 if condition to assign square position
    //Create board to store square
    //Sizing the board by following input column and screen responsive
    //Create board index UI
    createBoard() {
        let currentBoard = document.getElementById("board")

        //Use 2 loop condition to put the square to the board start from i = area and decrement for setting start square (index 0) at bottom
        //1st loop condition is even no. loof will sort the number from right to left
        //2nd loop condition is odd no. loof will sort the number from left to right
        for(let i = this.area - 1 ; i >= 0  ; i--) {
            if ( Math.floor((i / this.column)%2) === 0) {
                this.board[i] = new Board(i)

                let square = document.createElement('div')
                square.id = "square"+i
                square.className = "square"
                
                //Responsive for the square in board
                if (this.row <= 5 && this.column > 6 ) {
                    square.classList.add("squareMedium")
                } else if (this.row <= 5 ) {
                    square.classList.add("squareLarge") 
                } else if (this.row <= 7 ) {
                    square.classList.add("squareMedium") 
                } else {
                    square.classList.add("squareSmall") 
                }

                //Add board index for UI
                currentBoard.appendChild(square)
                square.innerHTML = `<h4 id="squareIndex">${i}</h4>`
                if(i === 0) { square.innerHTML = `<h4 id="squareIndex">START</h4>`}
                if(i === this.area - 1) { square.innerHTML = `<h4 id="squareIndex">FINISH</h4>`} 
                
                let imageContainer = document.createElement('div')
                imageContainer.id = `imageContainer${i}`
                imageContainer.className = "imageContainer"
                square.appendChild(imageContainer)

            } else {
                let k = Math.ceil((i+1)/this.column)*this.column - (i + 1) + Math.floor(i/this.column)*this.column
                this.board[k] = new Board(k)

                let square = document.createElement('div')
                square.id = "square"+ k
                square.className = "square"

                if (this.row <= 5 && this.column > 6 ) {
                    square.classList.add("squareMedium")
                } else if (this.row <= 5 ) {
                    square.classList.add("squareLarge") 
                } else if (this.row <= 7 ) {
                    square.classList.add("squareMedium") 
                } else {
                    square.classList.add("squareSmall") 
                }

                currentBoard.appendChild(square)
                square.innerHTML = `<h4 id="squareIndex">${k}</h4>`
                if(k === 0) { square.innerHTML += `<h4 id="squareIndex">START</h4>`}
                if(k === this.area - 1) { square.innerHTML += `<h4 id="squareIndex">FINISH</h4>`}

                let imageContainer = document.createElement('div')
                imageContainer.id = `imageContainer${k}`
                imageContainer.className = "imageContainer"
                square.appendChild(imageContainer)
            }
        }

        document.getElementById(`square${this.area - 1}`).classList.add("startAndFinish")
        document.getElementById("square0").classList.add("startAndFinish")

        let squareSize
        
        //Responsive for the board which matching to square size, input column and input row
        if (this.row <= 5 && this.column > 6 ) {
            squareSize = 100
        } else if (this.row <= 5 ) {
            squareSize = 160
        } else if (this.row <= 7 ) {
            squareSize = 100
        } else {
            squareSize = 90
        }
        currentBoard.style.width = `${squareSize*this.column}px`

        //Set each player at start for UI
        for(let j=0 ; j < this.player.length ; j++) {
            let startPlayer = document.createElement('img')
            startPlayer.id = `player${j}Position0`
            startPlayer.src = `Image/player${j+1}.svg`
            document.getElementById('imageContainer0').appendChild(startPlayer)
        }

    }

    //Set special move in the board
    //Use some random number to create special move
    //Assign the special move into random position of the board
    //There are 3 types of special move : 1) Move forward 2) Move backward 3) Move to start
    setBoardSpecialMove() {

        //Random value of special move
        const MoveForward = Math.round(Math.random() * (this.area /2)) + 1
        const MoveBackward = - (Math.round(Math.random() * (this.area /2)) +1 )
        const MoveToStart = 0

        //Random index of special move
        //Use if condition to avoid bug like generating special move at start or special move cause infinity loop
        const MoveForwardIndex = Math.round(Math.random() * (this.area - MoveForward - 3) + 1) 
        document.getElementById(`square${MoveForwardIndex}`).innerHTML = document.getElementById(`square${MoveForwardIndex}`).innerHTML + `<p>Move Forward ${MoveForward}</p>`

        function MoveBackwardIndex(area)  {
            while(true) {
                let randomBackwardIndex = Math.round(Math.random() * (area + MoveBackward -2)) - MoveBackward
                if (randomBackwardIndex != MoveForwardIndex ) { 
                    document.getElementById(`square${randomBackwardIndex}`).innerHTML = document.getElementById(`square${randomBackwardIndex}`).innerHTML + `<p>Move Backward ${-MoveBackward}</p>`
                    return randomBackwardIndex}
            }
        }
        
        function MoveToStartIndex (MoveBackwardIndex, area)  {
            while(true) {
                let randomTostartIndex = Math.round(Math.random() * (area - 4)) + 2 
                if ((randomTostartIndex != MoveForwardIndex) && (randomTostartIndex != MoveBackwardIndex) && (randomTostartIndex != MoveForwardIndex + MoveForward) && (randomTostartIndex != MoveBackwardIndex - MoveBackward)) { 
                    document.getElementById(`square${randomTostartIndex}`).innerHTML = document.getElementById(`square${randomTostartIndex}`).innerHTML + `<p>Move to start!</p>`
                    return randomTostartIndex}
            }
        }

        //Put speical move to board properties
        const moveBackwardVariable = MoveBackwardIndex(this.area)
        const moveTostartVariable = MoveToStartIndex(moveBackwardVariable, this.area)

        this.board[MoveForwardIndex].specialMoveAdd = MoveForward
        this.board[moveBackwardVariable].specialMoveAdd = MoveBackward
        this.board[moveTostartVariable].specialMoveMultiply = MoveToStart

        document.getElementById(`square${MoveForwardIndex}`).classList.add("moveForward")
        document.getElementById(`square${moveBackwardVariable}`).classList.add("moveBackward")
        document.getElementById(`square${moveTostartVariable}`).classList.add("moveToStart")
    }

    //Set the player turn after player roll the dice
    //Turn x = player x will roll
    setTurn() {
        if(document.getElementById(`player${this.turn}`)){
            document.getElementById(`player${this.turn}`).classList.remove("playTurnActive")
            this.turn++
            if(this.turn > this.players - 1) {
                this.turn = 0
            }
            document.getElementById(`player${this.turn}`).classList.add("playTurnActive")
        }
    }

    //Set moving step of player
    //Will use in loop after dice rolled
    playerMove(playerIndex) {
        if (document.getElementById(`imageContainer${this.player[playerIndex].score}`)) {
            //Add player score 1 to move 1 square
            this.player[playerIndex].score +=1

            //Add UI in board
            let playerPosition = document.createElement('img')
            playerPosition.id = `player${playerIndex}Position${this.player[playerIndex].score}`
            playerPosition.src = `Image/player${playerIndex+1}.svg`
            document.getElementById(`imageContainer${this.player[playerIndex].score}`).appendChild(playerPosition)
            document.getElementById(`player${playerIndex}Position${this.player[playerIndex].score-1}`).remove()

            //Check end game condition
            if(this.player[playerIndex].score === (this.area - 1)) {
                this.gameEnd(playerIndex)
            }
        }
    }

    //Create random point for player of this turn
    //Call playerMove = dice rolled point times
    //Set The board and player turn
    diceRoll() {
        const dicePoint = Math.round((Math.random()*6)+0.5)

        //Add animation roll shake when the dice is rolled
        document.getElementById("dicePic").classList.add("shake")
        setTimeout(() => {document.getElementById("dicePic").classList.remove("shake")},500)

        //Disable the roll button, prevent rolling before moving finished, Enable after all the move done
        document.getElementById("diceRollBtn").disabled = true
        setTimeout(() => {document.getElementById("diceRollBtn").disabled = false}, (dicePoint+1.1)*500)

        //Check player who has to move after roll
        for(let i=0 ; i < this.players; i++) {
            if(this.player[i].playerIndex === this.turn) {

                //Set player move each step delay 500ms
                for(let j=0 ; j < dicePoint ; j++) {
                    setTimeout(() => {this.playerMove(i)}, j*500)
                    if(this.player[i].score === (this.area - 1)) {
                        break
                    }
                }

                //Check specail move after normal move done
                //If player is in special move index, continue the moving by following special move condition
                setTimeout(() => {
                    if(this.board[this.player[i].score].specialMoveAdd !== 0) {

                        let moveText = "Move Forward"
                        if (this.board[this.player[i].score].specialMoveAdd < 0) {
                            moveText = "Move Backward" 
                        }
                        document.getElementById("diceText").innerText += ` ${moveText} ${Math.abs(this.board[this.player[i].score].specialMoveAdd)}`

                        document.getElementById(`player${i}Position${this.player[i].score}`).remove()
                        this.player[i].score = this.player[i].score + this.board[this.player[i].score].specialMoveAdd
                        
                        let playerPosition = document.createElement('img')
                        playerPosition.id = `player${i}Position${this.player[i].score}`
                        playerPosition.src = `Image/player${i+1}.svg`
                        document.getElementById(`imageContainer${this.player[i].score}`).appendChild(playerPosition)
                }
                        if(this.board[this.player[i].score].specialMoveMultiply === 0) {
                        document.getElementById("diceText").innerText += " Move to start!"
                        
                        document.getElementById(`player${i}Position${this.player[i].score}`).remove()
                        this.player[i].score = this.player[i].score * this.board[this.player[i].score].specialMoveAdd
                        
                        let playerPosition = document.createElement('img')
                        playerPosition.id = `player${i}Position${this.player[i].score}`
                        playerPosition.src = `Image/player${i+1}.svg`
                        document.getElementById(`imageContainer${this.player[i].score}`).appendChild(playerPosition)
                    }

                    //Set the record after all move done
                    document.getElementById("history").innerHTML = document.getElementById("history").innerHTML + `</br>${this.counter}. Player${this.player[i].playerIndex+1}__________Roll: ${dicePoint} Position: ${this.player[i].score}`
                    this.counter++
                }, (dicePoint+1.1)*500)

                document.getElementById("dicePic").src = `Image/dice${dicePoint}.svg`
                document.getElementById("diceText").innerText = ` Player ${i+1} rolled ${dicePoint} `
            }
        }
        //Assign turn after moving finished
        setTimeout(() => {this.setTurn()}, dicePoint*500)
    }

    //When player finish and show result
    gameEnd(player) {
            document.getElementById("winnerAlert").classList.toggle("hidden")
            document.getElementById("winnerAlert").classList.toggle("winnerDisplay")
            document.getElementById("playerText").innerHTML = `Winner is Player${player+1}`
            
            document.getElementById("exitBtn").addEventListener("click", () => {
                location.reload()
            })
    }
}

//Set player properties
//Score x of player y means player y is in board index x now
class Player {
    constructor(playerIndex) {
        this.playerIndex = playerIndex
    }
    score = 0
}

//Set board index
//Special move will use on special move's square index
class Board {
    constructor(index) {
        this.index = index
    }
    specialMoveAdd = 0
    specialMoveMultiply = 1
}