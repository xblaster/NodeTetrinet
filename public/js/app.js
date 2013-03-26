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


		$rootScope.mode = "game";


		$("#message").blur(function() {
			$rootScope.mode = "game";
			$("#game").focus();
			//$rootScope.$digest();
		});

		$("body").keydown(function(e) {
			//console.log(e.keyCode);

			if (e.keyCode==9) {
				e.preventDefault();
				console.log($rootScope);
				if ($rootScope.mode === "game") {
					$rootScope.mode = "chat";
					$("#message").focus();
					$("#message").click();
				} else {
					$rootScope.mode = "game";
					$("#game").focus();
					$("#game").click();
				}
			}

			if ($rootScope.mode === "game") {
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
			}
		});
	})


	var socket = io.connect("http://localhost:3000");
	socket.on('news', function(data) {
		console.log(data);
	}) 

	console.log(socket);

});

