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
}
	
Block.prototype.clone =  function() {
			var res = new Block(this.pattern);
			res.rotation = this.rotation;
			res.x = this.x;
			res.y = this.y;
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
			return {boxShadow: 'inset 0px 0px 5px 1px rgba(255,255,255,0.1)'};
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

	var sendDropTick = function() {
		$rootScope.$broadcast('drop', {})
	}


	function getGameTick() {
		return 1000;
	}

	$scope.$on('drop', function(event, eventType) {
		console.log("drop");
		if (testHitBlock($scope.hiddenZone, getDroppedBlock(current_block))) {
			$scope.hiddenZone = addBlock($scope.hiddenZone, current_block);
			askNewBlock();
		} else {
			current_block = getDroppedBlock(current_block);
		}

		//refresh game screen
		$scope.refresh();
		$timeout(sendDropTick, getGameTick());
	});

	$timeout(sendDropTick, getGameTick());

	$scope.$on('gameEvent', function(event, eventType) {

		var nextBlockPos = current_block.clone();

		if (eventType == tetris.GameEventEnum.UP) {
			nextBlockPos.rotate() ;
		} else if (eventType == tetris.GameEventEnum.DOWN) {
			nextBlockPos.x +=1;
		} else if (eventType == tetris.GameEventEnum.LEFT) {
			nextBlockPos.y -=1;
		} else if (eventType == tetris.GameEventEnum.RIGHT) {
			nextBlockPos.y +=1;
		} else if (eventType == tetris.GameEventEnum.DROP) {

			$scope.hiddenZone = addBlock($scope.hiddenZone, getGravitiedBlock($scope.hiddenZone,nextBlockPos));
			askNewBlock();			
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
		console.log($scope.zone)
		$scope.$digest();
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

	function addBlock(zone, block) {
		return addBlock(zone, block, tetris.BlockType.GREEN);
	}

	function addBlock(zone, block, type) {
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

	function askNewBlock() {
		current_block = new Block(cloneZone(blocks[Math.floor(Math.random()*blocks.length)]));
		current_block.x = 0;
		current_block.y = 5;
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