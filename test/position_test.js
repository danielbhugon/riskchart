var assert = require('assert');
var trader = require('../lib/trader.js');

describe('Position', function() {

	// months are zero-indexed
	const jan = {name: 'Jan-16', start_date: new Date(2016,0,1), end_date: new Date(2016,1,1), time_amount: 672};
	const apr = {name: 'Apr-16', start_date: new Date(2016,3,1), end_date: new Date(2016,4,1), time_amount: 672};
	const q1 = {name: 'Q1-16', start_date: new Date(2016,0,1), end_date: new Date(2016,3,1), time_amount: 2184};
	//id, product, contract, rate, price, info
	const trade1 = new trader.Trade(
		0,
		{name: 'baseload'},
		q1,
		10.0,
		24.5,
		"this is a test trade"
		);

	const trade2 = new trader.Trade(
		0,
		{name: 'baseload'},
		jan,
		10.0,
		24.5,
		"this is a test trade"
		);
	
	const trade3 = new trader.Trade(
		0,
		{name: 'baseload'},
		apr,
		10.0,
		24.5,
		"this is a test trade"
		);
	
	const oneTrade = new trader.Position([trade1]);
	
	const twoTrades = new trader.Position([trade1, trade2]);
	
	const threeTrades = new trader.Position([trade1, trade2, trade3]);
	
	describe('#totalCost()', function() {
		it('should have same total cost as trade if only one trade', function() {
			assert.equal(oneTrade.totalCost(), trade1.totalCost());
		});
		
		it('should have total cost as sum of total cost of trades', function(){
			assert.equal(twoTrades.totalCost(), trade1.totalCost() + trade2.totalCost());
		});
	});
	
	describe('#totalVolume()', function() {
		it('should have same total volume as trade if only one trade', function() {
			assert.equal(oneTrade.totalVolume(), trade1.totalVolume());
		});
		
		it('should have total volume as sum of total volume of trades', function(){
			assert.equal(twoTrades.totalVolume(), trade1.totalVolume() + trade2.totalVolume());
		});
	});
	
	describe('#project(contract)', function() {
		
		it('should not affect the trades', function(){
			assert.deepEqual(twoTrades.project(q1).trades, [trade1, trade2]);
		});
		
		
		it('should be left with only contracts contained within period', function(){
			assert.equal(threeTrades.project(q1).trades.length, 2);
			assert.deepEqual(threeTrades.project(q1).trades, [trade1, trade2]);
		});
		
		
		it('should reduce both trades to be for january contract', function(){
			const result = twoTrades.project(jan);
			
			assert.equal(result.trades.length, 2);
			assert.deepEqual(result.trades[0].contract, jan);
			assert.deepEqual(result.trades[1].contract, jan);
		});
	});
});
