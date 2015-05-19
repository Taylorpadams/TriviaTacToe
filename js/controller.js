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
		self.getTrivia = getTrivia;
		self.resetPlayers = resetPlayers;
		
		self.checkAnswer = checkAnswer;
		self.theTurn = null;
		self.triv = null;
		self.isFlipped = false;
		self.boxIndex = null;
		self.choice = null;
		self.setA = setA;
		self.setB = setB;
		self.setC = setC;
		self.setD = setD;

		self.player = null;
		self.newPlayer = newPlayer;
		self.playerName = "";
		
    	function getGameState(){
    		var ref = new Firebase("https://triviatactoe.firebaseio.com/");
    		var gameState = $firebaseObject(ref);
    		return gameState;
    	}

    	self.gameState = getGameState();

    	function newPlayer(){
    		if(self.gameState.player1.present === false){
    			self.gameState.player1.present = true;
    			self.player = "Player 1";
    			self.gameState.player1.name = self.playerName;
    			console.log("Player 1");
    		}
    		else if(self.gameState.player2.present === false){
    			self.gameState.player2.present = true;
    			self.player = "Player 2"
    			self.gameState.player2.name = self.playerName;
    			console.log("Player 2")
    		}else{
    			self.player = "Guest";
    			console.log('guest')
    		}
    		self.playerName = "";
    		self.gameState.$save(self.gameState);
    	}

    	function resetPlayers(){
    		console.log("resetting players");
			self.gameState.player1.present = false;
			self.gameState.player2.present = false;
			self.gameState.player1.name = "";
			self.gameState.player2.name = "";
			self.gameState.$save(self.gameState);
			self.player = "";
		}

    	function getTrivia() {
    		console.log("getting trivia");
    		self.triv = self.gameState.trivia[Math.floor(Math.random() * self.gameState.trivia.length)];
    			console.log("the key is " + self.triv.key);
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
			checkAnswer();
		}
		function setB(){
			self.choice = 2;
			checkAnswer();
		}
		function setC(){
			self.choice = 3;
			checkAnswer();
		}
		function setD(){
			self.choice = 4;
			checkAnswer();
		}

		function checkAnswer(){
			console.log("checking answer");
			var q = self.boxIndex;
			self.gameState.boxes[q].isQ = false;
				if(self.theTurn == "X" && self.choice == self.triv.key){
					console.log("X should be in the box");
					self.gameState.boxes[q].isX = true;
					self.gameState.stat = self.gameState.player2.name + "'s Move";
				}
				else if(self.theTurn == "O" && self.choice == self.triv.key){
					console.log("O should be here");
					self.gameState.boxes[q].isO = true;
					self.gameState.stat = self.gameState.player1.name + "'s Move";
				}
				else if(self.theTurn == "X"){
					console.log("X didnt work")
					self.gameState.stat = self.gameState.player2.name +"'s Move";
				}
				else if(self.theTurn == "O"){
					console.log("O didnt work")
					self.gameState.stat = self.gameState.player1.name + "'s Move";
				}
			
			
			self.isFlipped = false;
			self.gameState.$save(self.gameState.boxes);
			self.gameState.$save(self.gameState.stat);
			chooseWinner();
		}


		

		//reacts to box being clicked and places an X or O in the box 
		// 	by changing the values in the boxes array
		function chooseBox(index){
			console.log(self.theTurn);
			console.log(self.player);	
			self.boxIndex = index;
			console.log(self.boxIndex);
			self.theTurn = takeTurns();
			//boxes cannot be checked twice	
			if(self.gameState.boxes[index].isX == true 
				|| self.gameState.boxes[index].isO == true){ 
					alert("Pick another box!");
					return;
				}
				
				if(self.theTurn == "O" && self.player == "Player 2"){
					self.gameState.boxes[index].isQ = true;
					self.gameState.$save(self.gameState.boxes);
					getTrivia();
					self.isFlipped = true;
					console.log("flipping")
				}
				else if(self.theTurn == "X" && self.player == "Player 1"){
					self.gameState.boxes[index].isQ = true;
					self.gameState.$save(self.gameState.boxes);
					getTrivia();
					self.isFlipped = true;
					console.log("flipping")
				}else{
					self.gameState.turn--;
					alert("You are a spectator! Don't be clickin!")
				}
				self.gameState.$save(self.gameState.boxes);
				self.gameState.$save(self.gameState.turn);
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
				self.gameState.stat = self.gameState.player1.name +"'s Wins!";
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
				self.gameState.stat = self.gameState.player2.name + "'s Wins!";
				self.gameState.$save(self.gameState.stat);

			}else{
				catsGame();
			}
		} //closing chooseWinner()

		//If all 9 squares are full with no winner, its a tie
		//and the game gets reset
		function catsGame() {
			if (self.gameState.turn == 9) {
				self.gameState.stat = "You both lose!";
				self.gameState.$save(self.gameState.stat)
			}
		}

		//Board is wiped clean
		function reset() {
			console.log("resetting");
			for (var i = 0 ; i <= 8 ; i++) {
				self.gameState.boxes[i].isX = false;
				self.gameState.boxes[i].isO = false;
				self.gameState.boxes[i].isQ = false;
				self.triv = null;
				self.gameState.$save(self.gameState.boxes);
			}
			self.gameState.stat = self.gameState.player1.name + "'s Move";
			self.gameState.turn = 0;
			self.gameState.$save(self.gameState.turn);
			self.gameState.$save(self.gameState.stat);
		}

		function resetScore() {
			self.gameState.stat = self.gameState.player1.name + "'s Move";
			self.gameState.score.p1Score = 0;
			self.gameState.score.p2Score = 0;
			self.gameState.$save(self.gameState.score);
			self.gameState.$save(self.gameState.stat);
		}




	}
			
		
    





