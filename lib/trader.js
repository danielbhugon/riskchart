

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
	
	project : function(contract) {
		const portion = this.overlap(contract);
		
		// assumes that contracts either completely within or completely distinct periods
		return portion > 0 ? new Trade(this.id, this.product, (portion<1 ? contract : this.contract), this.rate, this.price, this.info) : null;
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
	
	totalCost : function(){
		return this.trades.reduce(function(sum, trade){
			return sum + trade.totalCost();
		}, 0);
	},
	
	totalVolume : function() {
		return this.trades.reduce(function(sum, trade){
			return sum + trade.totalVolume();
		}, 0);
	},
	
	project: function(contract) {		
		return new Position(
			this.trades.map(function(trade){
				return trade.project(contract);
				}).filter(function(result){
					return result != null;
					}));
	}
};

exports.Trade = Trade;
exports.Position = Position;


