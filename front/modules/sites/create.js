'use strict';

angular.module('app').controller('CreateCtrl', function ($rootScope, $scope, $http, $location, sites, userAgents) {
	$scope.userAgents = userAgents.list();
	$scope.showAdvancedOptions = false;

	$scope.toggleAdvancedOptions = function() {
		$scope.showAdvancedOptions = !$scope.showAdvancedOptions;
	};

	$scope.add = function () {
		sites.save($scope.data).$promise.then(function siteScraped (site) {
			$rootScope.successMessage = null;
			if(site && site.message){
				$rootScope.errorMessage = null;
				$rootScope.isSuccess = true;
				$rootScope.successMessage = site.message;
			} else {
				$location.path('/view/' + site.directory);
			}
			
		},function(error) {
			console.log("my error", error);
			$rootScope.errorMessage = null;
			if(error.data && error.data.message){
				$rootScope.errorMessage = error.data.message;
			}
			
		});
	};

	$scope.reset = function () {
		$scope.setDefaults();
		$scope.scraperForm.$setPristine();
	};

	$scope.setDefaults = function () {
		var defaults = {
			url: '' ,
			request: {
				headers: {
					'User-Agent': $scope.userAgents[0].userAgent
				}
			}
		};
		$scope.data = angular.copy(defaults);
	};

	$scope.setDefaults();
});
