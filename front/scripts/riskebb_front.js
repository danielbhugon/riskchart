
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


riskEbbApp.controller('PortfolioReportController', function($scope, $http) {
	
	$scope.user = {id: 0, name: 'Powerisk'};
	$scope.portfolios = [];
	$scope.report = {};
	$scope.selectedPortfolio = {};
	$scope.startDate = '2014-07-01';
	$scope.endDate = '2015-10-31';
	
	$scope.refreshPortfolios = function(user){
		$http.get('/api/user/' + user.id + '/portfolios').then(function(response) {
			$scope.portfolios = response.data;
		});
	};
	
	$scope.refreshReport = function() {
		$http.get('/api/portfolio/' + $scope.selectedPortfolio.id + '/report?startDate=' + $scope.startDate + "&endDate=" + $scope.endDate).then(function(response){
			$scope.report = response.data;
			
			// Set the dimensions of the canvas / graph
			var margin = {top: 30, right: 50, bottom: 30, left: 50},
				width = 800 - margin.left - margin.right,
				height = 300 - margin.top - margin.bottom;

			// Set the ranges
			var x = d3.time.scale().range([0, width]);
			var y_price = d3.scale.linear().range([height, 0]);
			var y_volume = d3.scale.linear().range([height, 0]);
			
			
			// Define the axes
			var xAxis = d3.svg.axis().scale(x)
				.orient("bottom").ticks(10);

			var yAxis = d3.svg.axis().scale(y_price)
				.orient("left").ticks(5);

			var yAxis2 = d3.svg.axis().scale(y_volume)
				.orient("right").ticks(5);
			
				// Define the lines
			var vwapline = d3.svg.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y_price(d.vwap); });
			var marketline = d3.svg.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y_price(d.marketPrice); });
			var volumeline = d3.svg.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y_volume(d.volume); });
				
			// clear any previous chart
			d3.select("#chart svg").remove();
			// Adds the svg canvas
			var price_svg = d3.select("#chart")
				.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform", 
						  "translate(" + margin.left + "," + margin.top + ")");

			
				$scope.report.forEach(function(d) {
					d.date = new Date(d.date);
					d.close = +d.close;
				});
			
			
			// Scale the range of the data
			x.domain(d3.extent($scope.report, function(d) { return d.date; }));
			y_price.domain([0, d3.max($scope.report, function(d) { return d.vwap; })]);
			y_volume.domain([0, d3.max($scope.report, function(d) { return d.volume; })]);
			
			// Add the valueline paths.
			price_svg.append("path")
				.attr("class", "line market")
				.attr("d", vwapline($scope.report));
			
			price_svg.append("path")
				.attr("class", "line vwap")
				.attr("d", marketline($scope.report));
			
			
			price_svg.append("path")
				.attr("class", "line volume")
				.attr("d", volumeline($scope.report));
			
				
			// Add the X Axis
			price_svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			// Add the Y Axis
			price_svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);
			
			// Add the 2nd Y Axis
			price_svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + width + " ,0)")
				.call(yAxis2);
		});
	};
			
			
	
	$scope.refreshPortfolios($scope.user);
	
	
});



