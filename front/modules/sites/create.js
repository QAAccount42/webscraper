'use strict';

angular.module('app').controller('CreateCtrl', function ($rootScope, $scope, $http, $location, $timeout, sites, userAgents) {
	$scope.userAgents = userAgents.list();
	$scope.showAdvancedOptions = false;
	$scope.isAdding = false;

	$scope.toggleAdvancedOptions = function() {
		$scope.showAdvancedOptions = !$scope.showAdvancedOptions;
	};

	$scope.add = function () {
		if ($scope.isAdding) {
            return; 
        }

		$scope.isAdding = true;

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
			
		}).finally(function() {

            $timeout(function() {
                $scope.isAdding = false;
            }, 2000);
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
