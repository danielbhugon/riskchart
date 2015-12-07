var assert = require('assert');
var trader = require('../lib/trader.js');
var v = require('./setup');

describe('PriceCurve', function() {
	
	describe('#getPrice(product, contract)', function(){
		
		it('should return the price for the matching product and contract', function(){
			assert.equal(v.priceCurve.getPrice(v.baseload, v.jan), v.janBaseloadPrice.price);
			assert.equal(v.priceCurve.getPrice(v.baseload, v.apr), v.aprBaseloadPrice.price);
			assert.equal(v.priceCurve.getPrice(v.peak, v.jan), v.janPeakPrice.price);
			assert.equal(v.priceCurve.getPrice(v.peak, v.apr), v.aprPeakPrice.price);
		});
	});
	
	
});
