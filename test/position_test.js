var assert = require('assert');
var trader = require('../lib/trader.js');

describe('Position', function() {

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
	
	
	
});
