var assert = require('assert');
var trader = require('../lib/trader.js');
var v = require('./setup');

describe('Trade', function() {
	
	describe('#totalVolume()', function () {
		it('should return volume as product of rate and time', function () {
			assert.equal(v.trade1.totalVolume(), 10*v.q1.time_amount);
		});
	});

	describe('#totalCost()', function() {
		it('should return total cost', function() {
			assert.equal(v.trade1.totalCost(), 10*v.q1.time_amount*24.5); 
		});
	});
	
	describe('#overlap(contract)', function() {
		it('should calculate portion of sub-period', function(){
			assert.equal(v.trade1.overlap(v.jan), (31)/(31+29+31 - 1/24)); // don't forget leap year and clock change!
		});
		
		it('should return 100% for larger period', function() {
			assert.equal(v.trade2.overlap(v.q1), 1.0);
		});

		it('should return 100% for same period', function() {
			assert.equal(v.trade2.overlap(v.jan), 1.0);
		});

		it('should return zero for non-overlapping period', function() {
			assert.equal(v.trade2.overlap(v.apr), 0.0);
		});

		it('should return zero for non-overlapping period', function() {
			assert.equal(v.trade3.overlap(v.q1), 0.0);
		});
		
	});
	
	describe('#project(contract)', function(){
		it('should return trade with the same contract if contract contains it', function(){
			const result = v.trade2.project(v.q1);
			assert.deepEqual(result.contract, v.trade2.contract);
		});
		
		it('should return trade with reduced contract if contract is sub-period', function(){
			const result = v.trade1.project(v.jan);
			
			assert.deepEqual(result.contract, v.jan);
		});
		
		it('should return null if contracts do not overlap', function(){
			const result = v.trade2.project(v.apr);
			
			assert.equal(result, null);
		});
		
		
		it('should return null if contracts do not overlap', function(){
			const result = v.trade3.project(v.q1);
			assert.equal(result, null);
		});
	});
	
	describe('#marketValue(priceCurve)', function(){
		
		it('should have market value equal to price times volume', function(){
			assert.equal(v.trade2.marketValue(v.priceCurve), v.trade2.totalVolume()*v.janBaseloadPrice.price);
		});
		
		it('should have market value equal to price times volume', function(){
			assert.equal(v.trade3.marketValue(v.priceCurve), v.trade3.totalVolume()*v.aprBaseloadPrice.price);
		});
		
		it('should have null market value if a matching market price is not found', function(){
			assert.equal(v.trade1.marketValue(v.priceCurve), null);
		});
	});
	
	describe('#reverse()', function(){
		it('should give a trade with the opposite volume but other details the same');
	});
	
});
