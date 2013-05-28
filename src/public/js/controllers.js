'use strict';


var tetris = {}

tetris.GameEventEnum = {
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4,
	DROP: 5
}

tetris.BlockType = {
	EMPTY: 0,
	GREY: 1,
	CYAN: 2,
	GREEN: 3,
	RED: 4,
	BLUE: 5,
	PURPLE: 6,
	YELLOW: 7,
	GHOST: 999
}


function Block(pPattern) {
	this.pattern = pPattern;
	this.rotation = 0;

	this.x = 0;
	this.y = 0;
	this.typeB = tetris.BlockType.BLUE;
}
	
Block.prototype.clone =  function() {
			var res = new Block(this.pattern);
			res.rotation = this.rotation;
			res.x = this.x;
			res.y = this.y;
			res.typeB = this.typeB
			return res;
};
	
Block.prototype.getPattern = function() {
			return this.pattern[this.rotation];
};
	
Block.prototype.rotate = function() {
			this.rotation = (this.rotation+1)%4;
};



function GameCtrl($scope, $http, $location, $rootScope, $timeout, $routeParams) {
	
	var socket = io.connect( "http://"+window.location.host+'/game');
	window.socket = socket;
	socket.emit("join",{roomName: $routeParams.id, nickname: $rootScope.nickname});

	var current_block = [[]];

	var __mapOfBinding = [];

	var unregisterAllBinding = function() {
		console.log("unregister all bindings");
			for (var i = 0; i < __mapOfBinding.length; i++) {
				//console.log("unregister "+__mapOfBinding[i]);
				__mapOfBinding[i]();
			}

	}

	$scope.registerBinding = function(binding) {
		__mapOfBinding.push(binding);
	}

	$scope.gameState = "";


	socket.on('start', function(message) {
		socket.emit('updateGameField', $scope.hiddenZone);

		console.log("start receive");

		$scope.gameState = "on";
		$scope.askNewBlock();
		sendDropTick();
	});

	socket.on("addLines", function(nbline, eventType) {
		console.log("addLines"+nbline);
		$scope.hiddenZone = addAnnoyingLines($scope.hiddenZone, nbline);		
		$scope.$apply();
	})

	socket.on("owner", function(opt, eventType) {
		$scope.owner = 1;
		$scope.$apply();
	})

	//gamefield part

	$scope.gameFields = {};

	$scope.sendGameField = function() {
		socket.emit('updateGameField', $scope.hiddenZone);
	}

	socket.on('updateGameField' , function(opt, eventType) {
		//console.log('updateGAMEFIELD !!!')
		$scope.$apply(function() {
			$scope.gameFields[opt.nickname] = $scope.gameFields[opt.nickname] || {};
			if ($scope.gameFields[opt.nickname].zone === undefined) {
				$scope.gameFields[opt.nickname].zone = cloneZone(opt.zone);
			}
			applyZoneWithVal(opt.zone,$scope.gameFields[opt.nickname].zone);	
		})
	});

	socket.on('opponentGameOver' , function(opt, eventType) {
		$scope.$apply(function() {
			$scope.gameFields[opt.nickname] = $scope.gameFields[opt.nickname] || {};
			$scope.gameFields[opt.nickname].status = "gameover";	
		});


		var winner = true;
		//check if you're the latest to play
		for (var nickname in $scope.gameFields) {
			if ($scope.gameFields[nickname].status !== "gameover") {
				winner = false;
			}
		}

		if (winner) {
			$scope.$broadcast('youwin', {});
		}
	});
	
	$scope.registerBinding($scope.$on('youwin', function(event, eventType) {		//socket.emit("gameover",{});
		if ($scope.gameState!== "You win !") {
			$scope.gameState = "You win !";
			socket.emit('win');
		}
		
	}));


	var totalLine = 0;	

	$scope.launchGame = function() {
		$scope.owner = 0;
		socket.emit('start');
	}

	$scope.setCell = function (x, y, val) {
		$scope.hiddenZone[x][y] = val;
	}

	$scope.getClassFor = function(cell) {

		var res = {};
		res['block'+cell] = true;

		return res;
	}




		//init gamezone
	
	var i_block = [
				   [[0,1,0,0],
				   [0,1,0,0],
				   [0,1,0,0],
				   [0,1,0,0]]
				   ,
				   [[0,0,0,0],
				   [1,1,1,1],
				   [0,0,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,0,1,0],
				   [0,0,1,0],
				   [0,0,1,0],
				   [0,0,1,0]]
				   ,
				   [[0,0,0,0],
				   [0,0,0,0],
				   [1,1,1,1],
				   [0,0,0,0]]
				   
				   ]
				   ;

	var z_block = [
				   [[0,1,1,0],
				   [0,0,1,1],
				   [0,0,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,0,1,0],
				   [0,1,1,0],
				   [0,1,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,1,1,0],
				   [0,0,1,1],
				   [0,0,0,0],
				   [0,0,0,0]]
				   ,
				  [[0,0,1,0],
				   [0,1,1,0],
				   [0,1,0,0],
				   [0,0,0,0]]
				   
				   ]
				   ;

	var s_block = [
				   [[0,0,1,1],
				   [0,1,1,0],
				   [0,0,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,0,1,0],
				   [0,0,1,1],
				   [0,0,0,1],
				   [0,0,0,0]]
				   ,
				   [[0,0,1,1],
				   [0,1,1,0],
				   [0,0,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,0,1,0],
				   [0,0,1,1],
				   [0,0,0,1],
				   [0,0,0,0]]
				   
				   ]
				   ;

	var o_block = [
				   [[0,0,0,0],
				   [0,1,1,0],
				   [0,1,1,0],
				   [0,0,0,0]]
				   ,
				   [[0,0,0,0],
				   [0,1,1,0],
				   [0,1,1,0],
				   [0,0,0,0]]
				   ,
				   [[0,0,0,0],
				   [0,1,1,0],
				   [0,1,1,0],
				   [0,0,0,0]]
				   ,
				   [[0,0,0,0],
				   [0,1,1,0],
				   [0,1,1,0],
				   [0,0,0,0]]
				   
				   ]
				   ;

	var l_block = [
				   [[0,1,0,0],
				   [0,1,0,0],
				   [0,1,1,0],
				   [0,0,0,0]]
				   ,
				   [[1,1,1,0],
				   [1,0,0,0],
				   [0,0,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,1,1,0],
				   [0,0,1,0],
				   [0,0,1,0],
				   [0,0,0,0]]
				   ,
				   [[0,0,1,0],
				   [1,1,1,0],
				   [0,0,0,0],
				   [0,0,0,0]]
				   
				   
				   ]
				   ;

	var j_block = [
				   [[0,0,1,0],
				   [0,0,1,0],
				   [0,1,1,0],
				   [0,0,0,0]]
				   ,
				   [[1,0,0,0],
				   [1,1,1,0],
				   [0,0,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,1,1,0],
				   [0,1,0,0],
				   [0,1,0,0],
				   [0,0,0,0]]
				    ,
				   [[1,1,1,0],
				   [0,0,1,0],
				   [0,0,0,0],
				   [0,0,0,0]]
				   ];


	var t_block = [
				   [[0,0,0,0],
				   [1,1,1,0],
				   [0,1,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,1,0,0],
				   [1,1,0,0],
				   [0,1,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,1,0,0],
				   [1,1,1,0],
				   [0,0,0,0],
				   [0,0,0,0]]
				   ,
				   [[0,1,0,0],
				   [0,1,1,0],
				   [0,1,0,0],
				   [0,0,0,0]]
				   
				   ]
				   ;

	var blocks = [i_block, z_block, s_block, o_block, l_block, j_block, t_block];

	

	var sendDropTick = function() {
		console.log("send drop");
		//$rootScope.$broadcast('drop', {})
		onDropTick({});
	}


	function getGameTick() {
		return 1000;
	}


	var timeoutId;


	var onBlockOnFloor =  function(eventType, event) {
		console.log("blockOnFloor");
		//stop update 
		$timeout.cancel(timeoutId);
		$scope.hiddenZone = addBlock($scope.hiddenZone, current_block);
		$scope.hiddenZone = checkAndRemoveFullLine($scope.hiddenZone);
		$scope.askNewBlock();

		
		$scope.refresh();

		$scope.sendGameField();

		//relaunch updateGAMEFIELD
		timeoutId = $timeout(sendDropTick, getGameTick());
	};

	


	

	//if destroy, remove ticket
	//TODO find a more elegant way to do that
	$scope.registerBinding($scope.$on("$destroy", function(event, eventType) {
		console.log("destroy controller");
		$scope.gameState = "gameover";
		$timeout.cancel(timeoutId);
		socket.emit('leave', {});
		socket.removeAllListeners();
		socket.disconnect();
		unregisterAllBinding();
	}));

	//$scope.$on('drop', function(eventType, event) {
	var onDropTick = function(event) {

		if ($scope.gameState != "on") { 
			return;
		}

		if (!event.force)//if not a force drop 
		{
			//launch next tick and store timeout id

			timeoutId = $timeout(sendDropTick, getGameTick());
		}

		
		if (testHitBlock($scope.hiddenZone, getDroppedBlock(current_block))) {
			onBlockOnFloor();
		} else {
				current_block = getDroppedBlock(current_block);
				//refresh game screen
				$scope.refresh();
		}
	};

	var wallKick = function (zone, block) {
		if (!testHitBlock(zone, block)) {
			return block
		}

		var blockP = block.clone();

		blockP.y = block.y -1;
		if (!testHitBlock(zone, blockP)) return blockP;

		blockP.y = block.y -2;
		if (!testHitBlock(zone, blockP)) return blockP;

		blockP.y = block.y +1;
		if (!testHitBlock(zone, blockP)) return blockP;

		blockP.y = block.y +2;
		if (!testHitBlock(zone, blockP)) return blockP;

		blockP.x = block.x -1;
		if (!testHitBlock(zone, blockP)) return blockP;

		return false;
	}

	$scope.registerBinding($scope.$on('gameover', function(event, eventType) {
		socket.emit("gameover",{});
		$scope.gameState = "gameover";
		$timeout.cancel(timeoutId);
	}));

	$scope.registerBinding($scope.$on('gameEvent', function(event, eventType) {

		if ($scope.gameState != "on") {
			return;
		}


		var nextBlockPos = current_block.clone();

		if (eventType == tetris.GameEventEnum.UP) {
			nextBlockPos.rotate() ;
		} else if (eventType == tetris.GameEventEnum.DOWN) {
			//$rootScope.$broadcast('drop', {force: true})
			onDropTick({force: true});
			return;
		} else if (eventType == tetris.GameEventEnum.LEFT) {
			nextBlockPos.y -=1;
		} else if (eventType == tetris.GameEventEnum.RIGHT) {
			nextBlockPos.y +=1;
		} else if (eventType == tetris.GameEventEnum.DROP) {

			current_block = getGravitiedBlock($scope.hiddenZone,nextBlockPos);
			//$rootScope.$broadcast('drop', {force: true})
			onDropTick({force: true});
			$scope.refresh();
			return;
		}
		
		//handle wallkick if necessary
		var finalBlockPos = wallKick($scope.hiddenZone,nextBlockPos);
		if (finalBlockPos!==false) {
			current_block = finalBlockPos;
		}

		$scope.refresh();
		return;
	}));


	$scope.refresh = function() {
		var ghostedZone = addBlock($scope.hiddenZone,getGravitiedBlock($scope.hiddenZone, current_block),tetris.BlockType.GHOST );
		var withBlockZone = addBlock(ghostedZone,current_block);
		applyZoneWithVal(withBlockZone, $scope.zone);
		$scope.$digest();
	}

	function removeLine(zone, l) {
		var returnZone = cloneZone(zone);
		for (var i = l-1; i >= 0; i--) {
			returnZone[i+1] = returnZone[i].slice(0);
		};

		//recreate first line
		for (var j = 0; j< 14; j++) {
			if (j <= 1 || j >=12) {
				returnZone[0][j] = 1;
			} else {
				returnZone[0][j] = 0;
			}
		}

		return returnZone;
	}

	function addAnnoyingLines(zone, lineNumber) {
		var returnZone = cloneZone(zone);

		var holeIndex = Math.floor(Math.random()*10)+2;

		for (var i =0; i < lineNumber; i++) {
			returnZone = addAnnoyingLine(returnZone, 21, holeIndex);
		}

		return returnZone;

	}

	function addAnnoyingLine(zone, l, holeIndex) {
		var returnZone = cloneZone(zone);
		for (var i = 0; i <= l; i++) {
			returnZone[i-1] = returnZone[i].slice(0);
		};

		//recreate line where eveything begin
		for (var j = 0; j< 14; j++) {
			if (j <= 1 || j >=12) {
				returnZone[l][j] = 1;
			} else {
				returnZone[l][j] = tetris.BlockType.BLUE;
			}
		}

		returnZone[l][holeIndex] = 0;

		return returnZone;
	}


	


	function isFullLine(zone, l) {
		for (var i = 0; i < zone[l].length; i++) {
			if (zone[l][i]==tetris.BlockType.EMPTY ) {
				return false;
			}
		}
		return true;
	}


	function checkAndRemoveFullLine(zone) {

		var returnZone = cloneZone(zone);

		var i = 21; //total line number;
		var lineCounter = 0;

		while (i >=0) {
			if (isFullLine(returnZone,i)) {
				returnZone = removeLine(returnZone, i);
				
				lineCounter++;
			} else {
				i--;
			}
		}

		if (lineCounter > 0) {
			socket.emit('line',lineCounter);
		}

		return returnZone;
	}


	function getDroppedBlock(block) {
		var droppedBlock = block.clone();
			droppedBlock.x +=1;
		
		return droppedBlock;
	}

	function getGravitiedBlock(zone, block) {
		var gravitiedBlock = block.clone();
		while (!testHitBlock(zone, gravitiedBlock)) {
			gravitiedBlock.x +=1;
		}

		gravitiedBlock.x -=1;

		return gravitiedBlock;
	}

	function addBlock(zone, block, type) {

		if (type === undefined) {
			type = block.typeB;
		}

			var returnZone = cloneZone(zone);
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (block.getPattern()[i][j]!= tetris.BlockType.EMPTY) {
					//if out of range
					if (_.isArray(returnZone[block.x+i])) {
						returnZone[block.x+i][block.y+j] = type;		
					} else {
						console.log("error occured in addBlock");
					}
				
				}
			}	
		}
		return returnZone;
	}

	$scope.askNewBlock = function () {
		var pieceIdx = Math.floor(Math.random()*blocks.length)
		current_block = new Block(cloneZone(blocks[pieceIdx]));
		current_block.x = 0;
		current_block.y = 5;
		//current_block.typeB = 3+Math.floor(Math.random()*3);
		current_block.typeB = pieceIdx+2;

		//if block it on placement... game over
		if (testHitBlock($scope.hiddenZone, current_block)) {
			$rootScope.$broadcast('gameover');
		}

	}	

	function testHitBlock(zone, block) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if ((block.getPattern()[i][j]!=tetris.BlockType.EMPTY)&&(zone[block.x+i][block.y+j]!=tetris.BlockType.EMPTY)) {
					return true;
				}
			}	
		}
		return false;
	}

	function removeBlock(zone, block) {
		//var returnZone = cloneZone(zone);
		var returnZone = cloneZone(zone);
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (block.getPattern()[i][j]) {
					returnZone[block.x+i][block.y+j] = 0
				}
			}	
		}
		return returnZone;
	}

	$scope.sendGameEvent = function(event) {
		$rootScope.$broadcast('gameEvent', event);
	}

	$scope.init = function() {
		//init game
		$scope.hiddenZone =[];
		for (var i = 0; i< 24; i++) {
			$scope.hiddenZone[i] = []
			for (var j = 0; j< 14; j++) {
				if (j <= 1 || j >=12) {
					$scope.hiddenZone[i][j] = 1;
				} else {
					$scope.hiddenZone[i][j] = 0;
				}
			}
		}	

		for (var j = 0; j< 14; j++) {
				$scope.hiddenZone[22][j] = 1;
			}

		for (var j = 0; j< 14; j++) {
				$scope.hiddenZone[23][j] = 1;
			}	

		//need to find a better way than cloning zone
		$scope.zone = cloneZone($scope.hiddenZone);
		applyZoneWithVal($scope.hiddenZone, $scope.zone);
		
	}


	/**
	 * clone a game zone
	 */
	function cloneBlock(block) {
		var clonedBlock = {};
		clonedBlock.x = block.x;
		clonedBlock.y = block.y;
		clonedBlock.rotation = block.rotation;
		clonedBlock.pattern = block.pattern;

		return clonedBlock;
	}

	/**
	 * clone a game zone
	 */
	function cloneZone(zone) {
		var newZone = []
		for (var i = 0; i< zone.length; i++) {
			newZone[i] = zone[i].slice(0);
		}
		return newZone;
	}

	/** apply zone1 on zone2 */
	function applyZone(zone1, zone2) {
		for (var i = 0; i< zone1.length; i++) {
			for (var j = 0; j< zone1[i].length; j++) {
				if (zone2[i][j] !== zone1[i][j]) {
					zone2[i][j] = zone1[i][j];
				}
			}
		}
	}

	function applyZoneWithVal(zone1, zone2) {

		if (!_.isArray(zone2)) {
			zone2 = [];
		}

		for (var i = 0; i< zone1.length; i++) {

			if (!_.isArray(zone2[i])) {
				zone2[i]= [];
			}	

			for (var j = 0; j< zone1[i].length; j++) {

				if (!_.isObject(zone2[i][j])) {
					zone2[i][j]= {val: 0};
				}	

				if (zone2[i][j].val !== zone1[i][j]) {
					zone2[i][j].val = zone1[i][j];
				}
			}
		}
	}

	$scope.init();
	$scope.askNewBlock();


	//$scope.refresh();

	
};


GameCtrl.$inject = ['$scope', '$http', '$location', '$rootScope', '$timeout', '$routeParams'];

var ChatCtrl= function($scope, $routeParams, $rootScope) {
	var socket = io.connect( "http://"+window.location.host+'/chat');

	$scope.lines = [];
	$scope.p = "hihi";

	socket.on('say', function(message) {
		$scope.lines.push(message);
		if ($scope.lines.length >15) {
			$scope.lines = $scope.lines.splice(-15);	
		}
		$scope.$apply();
		//$scope.$digest();
	});

	$scope.say = function() {
		socket.emit("say", $scope.message);
		$scope.message = "";
	}

	socket.on('people', function(event, eventType) {
		console.log(event);
		$scope.$apply(function(){
			$scope.people = event;
		});
	});

	$scope.$on("$destroy", function() {
		socket.removeAllListeners();
		socket.disconnect();
	});

	socket.emit("join",{roomName: $routeParams.id, nickname: $rootScope.nickname});
}

//ChatCtrl.$inject['$scope'];

ChatCtrl.$inject = ['$scope', '$routeParams','$rootScope'];

var IndexCtrl = function($scope, $location, $rootScope, $cookies) {

	$scope.mode = 'read';
	$scope.connected = false;



	$scope.changeMode = function(mode) { $scope.mode = mode ;}

	$scope.isAnonymous = function() {
		return $rootScope.nickname.indexOf("Anonymous")!==-1;
	}

	$scope.changeNickname = function(nickname) {
		$rootScope.nickname = nickname;
		$cookies.nickname = nickname; 
	}

	var socket = io.connect( "http://"+window.location.host+'/discover');
	socket.on('room', function(event, eventType) {
		if ($scope.connected === false) {
			$scope.connected = true;
		}
		$scope.rooms = event;
		$scope.$apply();
	});



	$scope.startNewGame = function() {
		$location.path("/game/"+Math.floor(Math.random()*9999));
	}

	socket.emit('ask');
}


IndexCtrl.$inject = ['$scope', '$location','$rootScope','$cookies'];