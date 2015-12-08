var trader = require('../lib/trader.js');

// products uniquely identified by only their name
const baseload = {id: 0, name: 'baseload'};
const peak = {id: 1, name: 'peak'};

// months are zero-indexed
const jan = {id: 0, name: 'Jan-16', start_date: new Date(2016,0,1), end_date: new Date(2016,1,1), time_amount: 672};
const apr = {id: 1, name: 'Apr-16', start_date: new Date(2016,3,1), end_date: new Date(2016,4,1), time_amount: 672};
const q1 = {id: 2, name: 'Q1-16', start_date: new Date(2016,0,1), end_date: new Date(2016,3,1), time_amount: 2184};

//id, product, contract, rate, price, info
const trade1 = new trader.Trade(
	0,
	baseload,
	q1,
	10.0,
	24.5,
	new Date(),
	"this is a test trade"
	);

const trade2 = new trader.Trade(
	0,
	baseload,
	jan,
	10.0,
	24.5,
	new Date(),
	"this is a test trade"
	);

const trade3 = new trader.Trade(
	0,
	baseload,
	apr,
	10.0,
	24.5,
	new Date(),
	"this is a test trade"
	);

const trade4 = new trader.Trade(
	0,
	baseload,
	apr,
	9.0,
	24.5,
	new Date(2001,01,01),
	"this is a test trade"
	);
	
const trade5 = new trader.Trade(
	0,
	baseload,
	apr,
	11.0,
	24.5,
	new Date(2002,01,01),
	"this is a test trade"
	);
	
const oneTrade = new trader.Position([trade1]);
const twoTrades = new trader.Position([trade1, trade2]);
const threeTrades = new trader.Position([trade1, trade2, trade3]);
const twoMonthTrades = new trader.Position([trade2, trade3]);
const tradesThroughTime = new trader.Position([trade4, trade5]);

//product, contract, price, price_date
const janBaseloadPrice = new trader.MarketPrice(baseload, jan, 1.0, new Date());
const aprBaseloadPrice = new trader.MarketPrice(baseload, apr, 2.0, new Date());

const janPeakPrice = new trader.MarketPrice(peak, jan, 3.0, new Date());
const aprPeakPrice = new trader.MarketPrice(peak, apr, 4.0, new Date());

const priceCurve = new trader.PriceCurve([janBaseloadPrice, aprBaseloadPrice, janPeakPrice, aprPeakPrice], new Date());

module.exports = {
	baseload: baseload,
	peak: peak,
	trade1: trade1,
	trade2: trade2,
	trade3: trade3,
	trade4: trade4,
	trade5: trade5,
	oneTrade: oneTrade,
	twoTrades: twoTrades,
	threeTrades: threeTrades,
	jan: jan,
	apr: apr,
	q1: q1,
	janBaseloadPrice: janBaseloadPrice,
	aprBaseloadPrice: aprBaseloadPrice,
	janPeakPrice: janPeakPrice,
	aprPeakPrice: aprPeakPrice,
	priceCurve: priceCurve,
	twoMonthTrades: twoMonthTrades,
	tradesThroughTime: tradesThroughTime
};
