
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


function Trade(id, product, contract, rate, price, info) {
	this.id = id;
	this.contract = contract;
	this.rate = rate;
	this.price = price;
	this.info = info;
}

Trade.prototype = {
	overlap: function(contract) {
		// NB: assumes that start and end date are inclusive
		const portion = (contract.end_date - Math.max(contract.start_date, this.contract.start_date) + 1)
			/(this.contract.end_date - this.contract.start_date + 1);
		
		return Math.min(1.0, Math.max(0.0, portion));
	};
	
	map : function(contract) {
		const portion = this.overlap(contract);
		
		// assumes that contracts either
		return portion > 0 ? new Trade(this.id, this.product, (portion<1 ? contract : this.contract), this.rate, this.price, info) : null;
	};
	
	totalVolumn: function() {
		return this.rate*this.contract.time_amount;
	};
	
	totalPaid : function() {
		return this.price*this.totalVolume();
	};
};

function Position(trades) {
	this.trades = trades;
};



