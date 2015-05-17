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
		self.reset = reset;
		self.resetScore = resetScore;
		self.getTriviaA = getTriviaA;
		self.getTriviaB = getTriviaB;
		self.checkAnswer = checkAnswer;
		self.theTurn = null;
		self.trivA = null;
		self.trivB = null;
		self.boxIndex = null;
		self.choice = null;
		self.setA = setA;
		self.setB = setB;
		self.setC = setC;
		self.setD = setD;
		



    	

    	function getGameState(){
    		var ref = new Firebase("https://triviatactoe.firebaseio.com/");
    		var gameState = $firebaseObject(ref);
    		return gameState;
    	}

    	self.gameState = getGameState();

    	function getTriviaA() {
    		console.log("getting trivia");
    		self.trivA = self.gameState.trivia[Math.floor(Math.random() * self.gameState.trivia.length)];
    			console.log("the key is " + self.trivA.key);
    	}

    	function getTriviaB() {
    		console.log("getting trivia");
    		self.trivB = self.gameState.trivia[Math.floor(Math.random() * self.gameState.trivia.length)];
    			console.log("the key is " + self.trivB.key);
    	}

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
		function setA(){
			self.choice = 1;
			console.log("The choice is ");
			checkAnswer();
		}
		function setB(){
			self.choice = 2;
			console.log("The choice is " + self.choice);
			checkAnswer();
		}
		function setC(){
			self.choice = 3;
			console.log("The choice is " + self.choice);
			checkAnswer();
		}
		function setD(){
			self.choice = 4;
			console.log("The choice is " + self.choice);
			checkAnswer();
		}

		function checkAnswer(){
			console.log("checking answer");
			var q = self.boxIndex;
				if(self.theTurn == "X" && self.choice == self.trivA.key){
					console.log("X should be in the box");
					self.gameState.boxes[q].isX = true;
					self.gameState.stat = "Player 2 Move";
				}
				else if(self.theTurn == "O" && self.choice == self.trivB.key){
					console.log("O should be here");
					self.gameState.boxes[q].isO = true;
					self.gameState.stat = "Player 1 Move";
				}
				else if(self.theTurn == "X"){
					console.log("X didnt work")
					self.gameState.stat = "Player 2 Move";
				}
				else if(self.theTurn == "O"){
					console.log("O didnt work")
					self.gameState.stat = "Player 1 Move";
				}
			self.gameState.$save(self.gameState.boxes);
			self.gameState.$save(self.gameState.stat);
			chooseWinner();
		}


		

		//reacts to box being clicked and places an X or O in the box 
		// 	by changing the values in the boxes array
		function chooseBox(index){	
			self.boxIndex = index;
			console.log(self.boxIndex)
			//boxes cannot be checked twice	
			if(self.gameState.boxes[index].isX == true 
				|| self.gameState.boxes[index].isO == true){ 
					alert("Pick another box!");
					return;
				}
				
		
				self.theTurn = takeTurns();
				if(self.theTurn == "X"){
					getTriviaA();
	
				}else{
					getTriviaB();
		
				}
		
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
				self.gameState.stat = "Player 1 Wins!";
				self.gameState.$save(self.gameState.stat);

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
				self.gameState.stat = "Player 2 Wins!";
				self.gameState.$save(self.gameState.stat);

			}else{
				catsGame();
			}
		} //closing chooseWinner()

		//If all 9 squares are full with no winner, its a tie
		//and the game gets reset
		function catsGame() {
			if (self.gameState.turn == 9) {
				self.gameState.stat = "Cat's Game";
				self.gameState.$save(self.gameState.stat)
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
			self.gameState.stat = "Player 1 Move"
			self.gameState.turn = 0;
			self.gameState.$save(self.gameState.turn);
			self.gameState.$save(self.gameState.stat);
		}

		function resetScore() {
			self.gameState.stat = "Player 1 Move"
			self.gameState.score.p1Score = 0;
			self.gameState.score.p2Score = 0;
			self.gameState.$save(self.gameState.score)
			self.gameState.$save(self.gameState.stat);
		}


	}
			
		
    





