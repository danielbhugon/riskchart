var assert = require('assert');
var trader = require('../lib/trader.js');
var v = require('./setup');

describe('Position', function() {
	
	describe('#totalCost()', function() {
		it('should have same total cost as trade if only one trade', function() {
			assert.equal(v.oneTrade.totalCost(), v.trade1.totalCost());
		});
		
		it('should have total cost as sum of total cost of trades', function(){
			assert.equal(v.twoTrades.totalCost(), v.trade1.totalCost() + v.trade2.totalCost());
		});
	});
	
	describe('#totalVolume()', function() {
		it('should have same total volume as trade if only one trade', function() {
			assert.equal(v.oneTrade.totalVolume(), v.trade1.totalVolume());
		});
		
		it('should have total volume as sum of total volume of trades', function(){
			assert.equal(v.twoTrades.totalVolume(), v.trade1.totalVolume() + v.trade2.totalVolume());
		});
	});
	
	describe('#project(contract)', function() {
		
		it('should not affect the trades', function(){
			assert.deepEqual(v.twoTrades.project(v.q1).trades, [v.trade1, v.trade2]);
		});
		
		
		it('should be left with only contracts contained within period', function(){
			assert.equal(v.threeTrades.project(v.q1).trades.length, 2);
			assert.deepEqual(v.threeTrades.project(v.q1).trades, [v.trade1, v.trade2]);
		});
		
		
		it('should reduce both trades to be for january contract', function(){
			const result = v.twoTrades.project(v.jan);
			
			assert.equal(result.trades.length, 2);
			assert.deepEqual(result.trades[0].contract, v.jan);
			assert.deepEqual(result.trades[1].contract, v.jan);
		});
	});
	
	describe('#VWAP()', function(){
		it('should simply return total cost divided by price', function(){
			assert.equal(v.oneTrade.VWAP(), v.trade1.totalCost()/v.trade1.totalVolume());
			
			assert.equal(v.twoTrades.VWAP(), (v.trade1.totalCost() + v.trade2.totalCost())/(v.trade1.totalVolume() + v.trade2.totalVolume()));
		});
	});
	
	describe('#marketValue(priceCurve)', function(){
		it('should be sum of market values', function(){
			assert.equal(v.twoMonthTrades.marketValue(v.priceCurve), v.trade2.marketValue(v.priceCurve) + v.trade3.marketValue(v.priceCurve));
		})
	})
});
