
'use strict';

var riskEbbApp = angular.module('riskEbbApp', ['ui.bootstrap.modal']);

angular.module('riskEbbApp').config(['$compileProvider', '$locationProvider', function ($compileProvider, $locationProvider)
    {
          $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|data):/);
			$locationProvider.html5Mode({
			  enabled: true,
			  requireBase: false
			});
    }]);



