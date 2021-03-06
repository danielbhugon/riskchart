

function Trade(id, product, contract, rate, price, trade_date, info) {
	this.id = id;
	this.product = product;
	this.contract = contract;
	this.rate = rate;
	this.price = price;
	this.trade_date = trade_date;
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
		return portion > 0 ? new Trade(this.id, this.product, (portion<1 ? contract : this.contract), this.rate, this.price, this.trade_date, this.info) : null;
	},
	
	totalVolume: function() {
		return this.rate*this.contract.time_amount;
	},
	
	totalCost : function() {
		return this.price*this.totalVolume();
	},
	
	marketValue: function(priceCurve) {
		const marketPrice = priceCurve.getPrice(this.product, this.contract);
		return marketPrice? marketPrice * this.totalVolume() : null;
	},
	
	reverse: function() {
		return new Trade(this.id, this.product, this.contract, -this.rate, this.price, this.trade_date, this.info)
	}
};

function Position(trades) {
	this.trades = trades;
};

Position.prototype = {
	
	totalCost : function(options){
		var selectedTrades = this.trades;
		if(options && options.asOf){
			selectedTrades = this.trades.filter(function(trade){
				return trade.trade_date <= options.asOf;
			});
		};
		
		return selectedTrades.reduce(function(sum, trade){
			return sum + trade.totalCost();
		}, 0);
	},
	
	totalVolume : function(options) {
		var selectedTrades = this.trades;
		if(options && options.asOf){
			selectedTrades = this.trades.filter(function(trade){
				return trade.trade_date <= options.asOf;
			});
		};
		
		return selectedTrades.reduce(function(sum, trade){
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
	},
	
	VWAP: function(options) {
		return this.totalCost(options)/this.totalVolume(options);
	},
	
	marketValue: function(priceCurve) {
		// only sum trades as of date of price curve
		return this.trades.filter(function(trade){
				return trade.trade_date <= priceCurve.price_date;
			}).reduce(function(sum, trade){
			return sum + trade.marketValue(priceCurve);
		}, 0);
	},
	
	add: function(position) {
		return new Position(this.trades.concat(position.trades));
	},
	
	subtract: function(position){
		return new Position(this.trades.concat(position.trades.map(function(trade){
			return trade.reverse();
		})));
	}
};

function MarketPrice(product, contract, price, price_date) {
	this.product = product;
	this.contract = contract;
	this.price = price;
	this.price_date = price_date;
};

function PriceCurve(marketPrices, price_date) {
	this.marketPrices = marketPrices;
	this.price_date = price_date;
};

PriceCurve.prototype = {
	getPrice : function(product, contract) {
		const matches = this.marketPrices.filter(function(marketPrice){
			return product.id == marketPrice.product.id &&
				contract.id == marketPrice.contract.id;
		});
		
		return matches.length == 1 ? matches[0].price : null;
	}
};


exports.Trade = Trade;
exports.Position = Position;
exports.MarketPrice = MarketPrice;
exports.PriceCurve = PriceCurve;


