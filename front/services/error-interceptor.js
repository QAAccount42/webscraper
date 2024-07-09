angular.module('app').factory('errorInterceptor', ['$rootScope', '$q',
	function ($rootScope, $q) {
		return {
			request: function request (config) {
				$rootScope.hasErrors = false;
				$rootScope.isSuccess = false;
				$rootScope.errorMessage = null;
				$rootScope.successMessage = null;
				return config;
			},
			responseError: function responseError (rejection) {
				$rootScope.hasErrors = true;
				$rootScope.isSuccess = false;
				return $q.reject(rejection);
			}
		};
}]);
