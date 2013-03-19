function SynthesisCtrl($scope, $http, $rootScope, $location) {
	var first = true;
	$scope.selected = '';
	$rootScope.fromAccount = $rootScope.toAccount = undefined;
	
	$http({
		method : 'GET',
		url : 'RepartitionAvoirs.xml',
		params : '',
		headers : {
		'Accept' : 'application/xml',
	},transformResponse : function(data) {
		var json = x2js.xml_str2json(data);
		return json;
	},
	cache : false,
	}).success(function(data, status) {
		$scope.avoirs = data.retour.AVOIRS_COMPTE.item;
		$scope.titres = data.retour.VALEURS_MOBIL.item;
		$scope.currentstep = 'step1'; 
		
		if($scope.avoirs != undefined){
			// Generation des datas pour le donut
			var graphDatas = extractValuesForDonut($scope.avoirs);
			var graphDatas2 = extractValuesForDonut($scope.avoirs, 'type');
   
			  var plot3 = $.jqplot('donutSynthese', [graphDatas, graphDatas2], {
			    seriesDefaults: {
			      // make this a donut chart.
			      renderer:$.jqplot.DonutRenderer,
			      rendererOptions:{
			        // Donut's can be cut into slices like pies.
			        sliceMargin: 3,
			        // Pies and donuts can start at any arbitrary angle.
			        startAngle: -90,
			        showDataLabels: true,
			        // By default, data labels show the percentage of the donut/pie.
			        // You can show the data 'value' or data 'label' instead.
			        dataLabels: 'label'
			      }
			    },
			    seriesColors: [ "#ff6f00", "#990033", "#ffa100", "#012661"],
			    grid : {
			    borderWidth : 0,
			    shadow : false,
			    background : 'transparent' },
			  });
		}
	}).error(function(data, status) {
		$scope.error = "Request failed" + data;
	});
	
	
	$scope.redrawGraph = function(){
		if($scope.compteOver != undefined && $scope.compteOver.plot != undefined){
			$.plot("#flotPlaceHolder", [{ color:'#012661', data: $scope.compteOver.plot }],{
				xaxis : { mode: "time", timeformat: "%d/%m/%Y", ticks : 3 }
			});
		}
	}
	
	$scope.compteOver = undefined;
	
	/* Survol d'un compte sur la synthese */
	$scope.mouseOverAvoir = function(avoir) {
		if($scope.selectedAccount != undefined)
		{
			return true;
		}
		
		if(avoir != $scope.compteOver){
			$scope.compteOver = avoir;
		}else{
			$scope.selectedAccount = $scope.compteOver;
		}
		
		$http({
			method : 'GET',
			url : 'compteCourant.json',
			cache : false
		}).success(function(data, status) {
			if (data != undefined) {
				$scope.lastMouvements = data;
				$scope.compteOver.plot = extractValuesAsPlot(data, avoir.SOLDE_EURO);
				if(first){
					setInterval(function(){
						$scope.redrawGraph();
					}, 200);
					first = false;
				}else{
					$scope.redrawGraph();
				}
				
			} else {
				$scope.lastMouvements = new Array();
				$('#flotPlaceHolder').hide();
			}
		}).error(function(data, status) {
			alert("Request failed" + data);
		});
		
	}
	
	$scope.mouseLeaveAvoir = function() {
		if($scope.selectedAccount == undefined){
			$scope.compteOver = undefined;
		}
	}
	
	$scope.click = function(selectedAvoir) {
		// Selection d'un compte ou deselection
		if($scope.selectedAccount === selectedAvoir){
			$scope.selectedAccount = undefined;
		}else{
			$scope.compteOver = $scope.selectedAccount = selectedAvoir;	
			$scope.redrawGraph();
		}
		
	}
	
	$scope.back = function() {
		$scope.currentstep = 'step1'; 
		$scope.selected =''
	}
	
	$scope.$on('dropEvent', function(evt, dropEvt, dragged, dropped) {
        if(dragged.LIBELLE != dropped.LIBELLE){
	        $rootScope.fromAccount = dragged;
	        $rootScope.toAccount = dropped;
	        
	        $scope.$apply(function() {
			  $location.path('/virement');
			});
		}
        //$location.url('/virement');
        
        //qtScope = angular.element(document.getElementById('quickTransferView')).scope(); 
        //qtScope.from = dragged;
        //qtScope.to = dropped;
        
        //$scope.$apply();
    });
}
