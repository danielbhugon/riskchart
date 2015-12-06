var config	= require('./config.json');
var express = require('express');
var pg		= require('pg');
var bodyParser = require('body-parser');
var app     = express();
var trader = require('./lib/trader.js');
var fs = require('fs');
var assert = require('assert');

var sql = fs.readFileSync('./db/init.sql').toString();

var connectionString = process.env.DATABASE_URL || "postgres://" + config.dbUser + ":" + config.dbPass + "@localhost:5432/" + config.dbName;
var client = new pg.Client(connectionString);
client.connect();

client.query(sql);

app.use(express.static(__dirname + config.staticFolder));
app.use(bodyParser.json());

app.listen(process.env.PORT || config.port);
console.log('server running on ' + config.port);
exports = module.exports = app;


app.get('/api/trades', function(req, res){
	executeQuery("SELECT trades.*, row_to_json(products.*) FROM trades inner join products on trades.product_id = products.id;", function(result) {
		res.json(result);
	});
});

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

// finally 404 result
app.use(function(req, res, next) {
  res.status(404).sendFile('404.html', {root: __dirname + config.staticFolder});
});
