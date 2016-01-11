'use strict';

var config	= require('./config.json');
var express = require('express');
var pg		= require('pg');
var bodyParser = require('body-parser');
var app     = express();
var trader = require('./lib/trader.js');
var fs = require('fs');
var assert = require('assert');
var trader = require('./lib/trader');
var async = require('async');

var sql = fs.readFileSync('./db/init.sql').toString();

var connectionString = process.env.DATABASE_URL || "postgres://" + config.dbUser + ":" + config.dbPass + "@127.0.0.1:5432/" + config.dbName;
var client = new pg.Client(connectionString);
client.connect();

client.query(sql);

app.use(express.static(__dirname + config.staticFolder));
app.use(bodyParser.json());

var port = process.env.PORT || config.port; 
app.listen(port);
console.log('server running on ' + port);
exports = module.exports = app;

app.get('/api/user/:id/portfolios', function(req, res){
	executeParameterizedQuery("SELECT * FROM portfolios WHERE user_id=$1;", [req.params.id], function(result) {
		res.json(result);
	});
});

app.get('/api/portfolio/:id/trades', function(req, res){
	getTradesByPortfolio(req.params.id, function(result){
		res.json(result);
	});
});

app.get('/api/portfolio/:id/report', function(req, res){
	// 
	var startDate = new Date(req.query.startDate);
	var endDate = new Date(req.query.endDate);
	
	var dateArray = createDateRange(startDate, endDate);
	
	getTradesByPortfolio(req.params.id, function(trades){
		
		var position = new trader.Position(trades);
		var getReportItem = function(nextDate, callBack) {
			getPricesByDate(nextDate, function(prices){
				
				if (prices.length > 0) {
					var curve = new trader.PriceCurve(prices, nextDate);
					var totalVolume = position.totalVolume({asOf:nextDate});
					var reportItem = {
							date: nextDate,
							volume: totalVolume,
							vwap: position.VWAP({asOf:nextDate}),
							marketPrice: position.marketValue(curve)/totalVolume
						};
					callBack(null, reportItem);
				}
				else {
					callBack(null, null);
				}
			});
		};
		
		async.map(dateArray, getReportItem, function(err, result){
			// finally remove any null values
			
			res.json(result.filter(function(item){return item !=null}));
		});
	});
});


// common query functions

var getTradesByPortfolio = function(id, callback) {
	var sql = "SELECT trades.*, row_to_json(products.*) AS product, row_to_json(contracts.*) AS contract FROM trades " +
		"INNER JOIN products ON trades.product_id = products.id " +
		"INNER JOIN contracts ON trades.contract_id = contracts.id " +
		"WHERE portfolio_id = $1;"
	executeParameterizedQuery(sql, [id], function(result) {
		var toTrades = result.map(function(row){
			//(id, product, contract, rate, price, trade_date, info)
			return new trader.Trade(row.id, row.product, row.contract, row.rate, row.price, row.trade_date, row.info);
		});
		callback(toTrades);
	});
};

var getPricesByDate = function(date, callback) {
	// product, contract, price, price_date
	var sql = "SELECT market_prices.id, row_to_json(products.*) AS product, row_to_json(contracts.*) AS contract, " +
		"market_prices.price, market_prices.price_date FROM market_prices " +
		"INNER JOIN products ON market_prices.product_id = products.id " +
		"INNER JOIN contracts ON market_prices.contract_id = contracts.id " +
		"WHERE price_date = $1;"
	executeParameterizedQuery(sql, [date], function(result) {
		callback(result);
	});
};

// helper functions for database access - replace with ORM if required?
var executeQuery = function(sql, callback) {
	var query = client.query(sql);
	
	query.on('row', function(row, result) {
		result.addRow(row);
	});
	
	query.on('end', function(result) {
		callback(result.rows);
	});
};

var executeParameterizedQuery = function(sql, params, callback) {
	var query = client.query(sql, params);
	
	query.on('row', function(row, result) {
		result.addRow(row);
	});
	
	query.on('end', function(result) {
		callback(result.rows);
	});
};

// functions for creating an array of dates
Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
};

var createDateRange = function(startDate, endDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= endDate) {
        dateArray.push( new Date (currentDate) )
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
};

// finally 404 result
app.use(function(req, res, next) {
  res.status(404).sendFile('404.html', {root: __dirname + config.staticFolder});
});
