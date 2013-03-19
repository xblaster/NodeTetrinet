var briceUrl = "http://192.168.1.107\\:8080/w3e/services/" + 'beneficiary/list';
var myUrl = "http://localhost\\:8888/poc-raiffeisen/beneficiaires.json";
var defaultPrefix = myUrl;

angular.module('pocServices', ['ngResource']).factory('Beneficiary', function($resource) {
	return $resource(defaultPrefix, {}, {
		query : {
			method : 'GET', isArray : true, params : {}
		}
	});
}); 




angular.module('TetrisService', ['ng']).factory('GameZoneService', function($rootScope) {


})