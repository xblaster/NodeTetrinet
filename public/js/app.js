'use strict';




angular.module('tetris', ['ng','TetrisService']).config(['$routeProvider',
function($routeProvider) {
	$routeProvider.when('/game', {
		templateUrl : 'partials/game.html',
		controller : GameCtrl
	})
	//.when('/avoir/:id', {templateUrl : 'partials/detailAvoir.html', controller: AvoirDetailCtrl})
	.otherwise({
		redirectTo : '/game'
	});
}])
//on application start
.run(function($rootScope) {
	$(document).ready(function() {
		$("body").keydown(function(e) {
			if (e.keyCode==38) {
				return $rootScope.$broadcast('gameEvent', tetris.GameEventEnum.UP);
			}
			if (e.keyCode==40) {
				return $rootScope.$broadcast('gameEvent', tetris.GameEventEnum.DOWN);
			}
			if (e.keyCode==37) {
				return $rootScope.$broadcast('gameEvent', tetris.GameEventEnum.LEFT);
			}
			if (e.keyCode==39) {
				return $rootScope.$broadcast('gameEvent', tetris.GameEventEnum.RIGHT);
			}
			if (e.keyCode==32) {
				return $rootScope.$broadcast('gameEvent', tetris.GameEventEnum.DROP);
			}
		});
	})


	var socket = io.connect("http://localhost:3000");
	socket.on('news', function(data) {
		console.log(data);
	}) 

	console.log(socket);

});

