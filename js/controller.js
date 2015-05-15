angular
    .module("tttApp")
    .controller("TttController", TttController);
        TttController.$inject = ['$firebaseObject']




    function TttController($firebaseObject){
    	var self = this;
    	self.takeTurns = takeTurns;
    	self.chooseBox = chooseBox;
    	self.chooseWinner = chooseWinner;
		self.catsGame = catsGame;


    	

    	function getGameState(){
    		var ref = new Firebase("https://triviatactoe.firebaseio.com/");
    		var gameState = $firebaseObject(ref);
    		return gameState;
    	}

    	self.gameState = getGameState();

    	//establishes two players (X & O) - one of them goes first and then they alternate
		function takeTurns(){    
			self.gameState.turn++;
			if (self.gameState.turn % 2 === 0){
				return "O";
			} else {
				return "X";
			}
			self.gameState.$save(self.gameState.turn);
		}

		//reacts to box being clicked and places an X or O in the box 
		// 	by changing the values in the boxes array
		function chooseBox(index){	
			//boxes cannot be checked twice	
			if(self.gameState.boxes[index].isX == true 
				|| self.gameState.boxes[index].isO == true){ 
					alert("Pick another box!");
					return;
				}
			//First selects a box and it is marked with their token (X or O)
			//Second player does the same (repeat pattern of turns) 
			//constantly check to see if a player has won. 
			var theTurn = takeTurns();
				if(theTurn == "X"){
					self.gameState.boxes[index].isX = true;
				}else{
					self.gameState.boxes[index].isO = true;
				}
			self.gameState.$save(self.gameState.boxes);
			chooseWinner();
		}
		// First player to get 3 connected consecutive boxes
		// marked with their token in horizontal, veritcal or
		// diagonal lines wins.
		function chooseWinner(){
			console.log("choosing winner");
			if(
				(self.gameState.boxes[0].isX === true 
				&& self.gameState.boxes[1].isX === true 
				&& self.gameState.boxes[2].isX === true)
				||
				(self.gameState.boxes[3].isX === true 
				&& self.gameState.boxes[4].isX === true 
				&& self.gameState.boxes[5].isX === true)
				||
				(self.gameState.boxes[6].isX === true 
				&& self.gameState.boxes[7].isX === true 
				&& self.gameState.boxes[8].isX === true)
				||
				(self.gameState.boxes[3].isX === true 
				&& self.gameState.boxes[4].isX === true 
				&& self.gameState.boxes[5].isX === true)
				||
				(self.gameState.boxes[0].isX === true 
				&& self.gameState.boxes[3].isX === true 
				&& self.gameState.boxes[6].isX === true)
				||
				(self.gameState.boxes[1].isX === true 
				&& self.gameState.boxes[4].isX === true 
				&& self.gameState.boxes[7].isX === true)
				||
				(self.gameState.boxes[3].isX === true 
				&& self.gameState.boxes[4].isX === true 
				&& self.gameState.boxes[5].isX === true)
				||
				(self.gameState.boxes[2].isX === true 
				&& self.gameState.boxes[5].isX === true 
				&& self.gameState.boxes[8].isX === true)
				||
				(self.gameState.boxes[0].isX === true 
				&& self.gameState.boxes[4].isX === true 
				&& self.gameState.boxes[8].isX === true)
				||
				(self.gameState.boxes[2].isX === true 
				&& self.gameState.boxes[4].isX === true 
				&& self.gameState.boxes[6].isX === true)
			){
				self.gameState.score.p1Score++;
				self.gameState.$save(self.gameState.score.p1Score);
				alert("X Wins!");
				reset();

			}else if(
				(self.gameState.boxes[0].isO === true 
				&& self.gameState.boxes[1].isO === true 
				&& self.gameState.boxes[2].isO === true)
				||
				(self.gameState.boxes[3].isO === true 
				&& self.gameState.boxes[4].isO === true 
				&& self.gameState.boxes[5].isO === true)
				||
				(self.gameState.boxes[6].isO === true 
				&& self.gameState.boxes[7].isO === true 
				&& self.gameState.boxes[8].isO === true)
				||
				(self.gameState.boxes[3].isO === true 
				&& self.gameState.boxes[4].isO === true 
				&& self.gameState.boxes[5].isO === true)
				||
				(self.gameState.boxes[0].isO === true 
				&& self.gameState.boxes[3].isO === true 
				&& self.gameState.boxes[6].isO === true)
				||
				(self.gameState.boxes[1].isO === true 
				&& self.gameState.boxes[4].isO === true 
				&& self.gameState.boxes[7].isO === true)
				||
				(self.gameState.boxes[3].isO === true 
				&& self.gameState.boxes[4].isO === true 
				&& self.gameState.boxes[5].isO === true)
				||
				(self.gameState.boxes[2].isO === true 
				&& self.gameState.boxes[5].isO === true 
				&& self.gameState.boxes[8].isO === true)
				||
				(self.gameState.boxes[0].isO === true 
				&& self.gameState.boxes[4].isO === true 
				&& self.gameState.boxes[8].isO === true)
				||
				(self.gameState.boxes[2].isO === true 
				&& self.gameState.boxes[4].isO === true 
				&& self.gameState.boxes[6].isO === true)
			){
				self.gameState.score.p2Score++;
				self.gameState.$save(self.gameState.score.p2Score);
				alert("O Wins!");
				reset();

			}else{
				catsGame();
			}
		} //closing chooseWinner()

		//If all 9 squares are full with no winner, its a tie
		//and the game gets reset
		function catsGame() {
			if (self.gameState.turn == 9) {
				alert("Cat's Game!");
				reset();
			}
		}

		//Board is wiped clean
		function reset() {
			console.log("resetting");
			for (var i = 0 ; i <= 8 ; i++) {
				self.gameState.boxes[i].isX = false;
				self.gameState.boxes[i].isO = false;
				self.gameState.$save(self.gameState.boxes);
			}
			self.gameState.turn = 0;
			self.gameState.$save(self.gameState.turn);
		}


	}
			
		
    





