

function Trade(id, product, contract, rate, price, info) {
	this.id = id;
	this.contract = contract;
	this.rate = rate;
	this.price = price;
	this.info = info;
}

Trade.prototype = {
	overlap: function(contract) {
		// NB: assumes that start and end date are exclusive, since date objects store time in milliseconds
		const portion = (Math.min(contract.end_date, this.contract.end_date) - Math.max(contract.start_date, this.contract.start_date))
			/(this.contract.end_date - this.contract.start_date);
		
		return Math.min(1.0, Math.max(0.0, portion));
	},
	
	map : function(contract) {
		const portion = this.overlap(contract);
		
		// assumes that contracts either
		return portion > 0 ? new Trade(this.id, this.product, (portion<1 ? contract : this.contract), this.rate, this.price, info) : null;
	},
	
	totalVolume: function() {
		return this.rate*this.contract.time_amount;
	},
	
	totalCost : function() {
		return this.price*this.totalVolume();
	},
};

function Position(trades) {
	this.trades = trades;
};

Position.prototype = {
	getZero : function(){
		return 0;
	}
};

exports.Trade = Trade;
exports.Position = Position;

