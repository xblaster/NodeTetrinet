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



function GameCtrl($scope, $http, $location, GameZoneService, $rootScope, $timeout) {
	
	




	$scope.setCell = function (x, y, val) {
		$scope.hiddenZone[x][y] = val;
	}

	$scope.getStyleFor = function(cell) {
		if (cell == tetris.BlockType.EMPTY) {
			return {backgroundColor: 'rgba(0,0,0,0.3)'};
		} 
		if (cell == tetris.BlockType.GREY) {
			return {backgroundColor: 'rgba(100,100,100,0.3)'};
		} 
		if (cell == tetris.BlockType.GHOST) {
			return {backgroundColor: 'rgba(0,0,0,0.2)', boxShadow: 'inset 0px 0px 3px 1px rgba(255,255,255,0.1)'};
		} 
		if (cell == tetris.BlockType.GREEN) {
			return {backgroundColor: 'rgba(0,255,0,0.3)', boxShadow: 'inset 0px 0px 5px 1px rgba(255,255,255,0.2)'};
		} 
		if (cell == tetris.BlockType.RED) {
			return {backgroundColor: 'rgba(255,0,0,0.3)', boxShadow: 'inset 0px 0px 5px 1px rgba(255,255,255,0.2)'};
		} 
		if (cell == tetris.BlockType.BLUE) {
			return {backgroundColor: 'rgba(0,0,255,0.3)', boxShadow: 'inset 0px 0px 5px 1px rgba(255,255,255,0.2)'};
		} 
		return {backgroundColor: 'rgba(0,255,0,0.3)', boxShadow: 'inset 0px 0px 5px 1px rgba(255,255,255,0.2)'};
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

	var s_block = [
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

	var j_block = [
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

	var current_block = new Block(j_block);
	current_block.x = 3; 
	current_block.y = 4;
	current_block.type = 5;

	var sendDropTick = function() {
		$rootScope.$broadcast('drop', {})
	}


	function getGameTick() {
		return 1000;
	}

	$scope.$on('drop', function(eventType, event) {
		if (testHitBlock($scope.hiddenZone, getDroppedBlock(current_block))) {
			$scope.hiddenZone = addBlock($scope.hiddenZone, current_block);
			$scope.hiddenZone = checkAndRemoveFullLine($scope.hiddenZone);
			$scope.askNewBlock();
		} else {
			current_block = getDroppedBlock(current_block);
		}

		console.log(event)
		//refresh game screen
		if (!event.force)//if not a force drop 
		{
			$timeout(sendDropTick, getGameTick());
		}
		$scope.refresh();
		
	});

	$timeout(sendDropTick, getGameTick());

	$scope.$on('gameEvent', function(event, eventType) {

		var nextBlockPos = current_block.clone();

		if (eventType == tetris.GameEventEnum.UP) {
			nextBlockPos.rotate() ;
		} else if (eventType == tetris.GameEventEnum.DOWN) {
			$rootScope.$broadcast('drop', {force: true})
			return;
		} else if (eventType == tetris.GameEventEnum.LEFT) {
			nextBlockPos.y -=1;
		} else if (eventType == tetris.GameEventEnum.RIGHT) {
			nextBlockPos.y +=1;
		} else if (eventType == tetris.GameEventEnum.DROP) {

			current_block = getGravitiedBlock($scope.hiddenZone,nextBlockPos);
			$rootScope.$broadcast('drop', {force: true})
			//$scope.askNewBlock();			
			$scope.refresh();
			return;
		}
		
		if (!testHitBlock($scope.hiddenZone, nextBlockPos)) {
			current_block = nextBlockPos;
		}

		$scope.refresh();
		return;
	});


	$scope.refresh = function() {
		var ghostedZone = addBlock($scope.hiddenZone,getGravitiedBlock($scope.hiddenZone, current_block),tetris.BlockType.GHOST );
		var withBlockZone = addBlock(ghostedZone,current_block);
		applyZone(withBlockZone, $scope.zone);
		$scope.$digest();
	}

	function removeLine(zone, l) {
		console.log("remove line "+l)
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
				returnZone[block.x+i][block.y+j] = type;
				}
			}	
		}
		return returnZone;
	}

	$scope.askNewBlock = function () {
		current_block = new Block(cloneZone(blocks[Math.floor(Math.random()*blocks.length)]));
		current_block.x = 0;
		current_block.y = 5;
		current_block.typeB = 3+Math.floor(Math.random()*3);
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

		$scope.zone = cloneZone($scope.hiddenZone);
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

	$scope.init();
	//$scope.refresh();
	
};