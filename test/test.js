var assert = require('assert');
var trader = require('../lib/trader.js');

describe('Trade', function() {

	// months are zero-indexed
	const jan = {name: 'Jan-16', start_date: new Date(2016,0,1), end_date: new Date(2016,1,1), time_amount: 672};
	const apr = {name: 'Apr-16', start_date: new Date(2016,2,1), end_date: new Date(2016,4,1), time_amount: 672};
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
	
	console.log(jan.start_date);
	console.log(jan.end_date);
	it('should be 31 days in Jan', function(){
		assert.equal((jan.end_date - jan.start_date)/(1000*60*60*24), 31);
	});
	
	
	describe('#totalVolume()', function () {
		it('should return volume as product of rate and time', function () {
			assert.equal(trade1.totalVolume(), 10*q1.time_amount);
		});
	});

	describe('#totalCost()', function() {
		it('should return total cost', function() {
			assert.equal(trade1.totalCost(), 10*q1.time_amount*24.5); 
		});
	});
	
	describe('#overlap(contract)', function() {
		it('should calculate portion of sub-period', function(){
			assert.equal(trade1.overlap(jan), (31)/(31+29+31 - 1/24)); // don't forget leap year and clock change!
		});
		
		it('should return 100% for larger period', function() {
			assert.equal(trade2.overlap(q1), 1.0);
		});

		it('should return 100% for same period', function() {
			assert.equal(trade2.overlap(jan), 1.0);
		});

		it('should return zero for non-overlapping period', function() {
			assert.equal(trade2.overlap(apr), 0.0);
		});


	});
});
