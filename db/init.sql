
CREATE TABLE IF NOT EXISTS products 
(
	id bigserial NOT NULL,
	name character varying(255),
	rate_label character varying(255),
	time_unit character varying(255),
	volume_label character varying(255),
	price_unit character varying(255),
	CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS contracts
(
	id bigserial NOT NULL,
	name character varying(255),
	start_date timestamp with time zone,
	end_date timestamp with time zone,
	time_amount double precision,
	CONSTRAINT contracts_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS market_prices
(
	id bigserial NOT NULL,
	contract_id bigint,
	product_id bigint,
	price_date timestamp with time zone,
	price double precision,
	CONSTRAINT market_prices_pkey PRIMARY KEY (contract_id, product_id, price_date)
);

CREATE TABLE IF NOT EXISTS users
(
	id bigserial NOT NULL,
	name character varying(255),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS trades
(
	id bigserial NOT NULL,
	portfolio_id bigint,
	product_id bigint,
	contract_id bigint,
	rate_amount double precision,
	price double precision,
	trade_date timestamp with time zone,
	info character varying(255),
	CONSTRAINT trades_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users
(
	id bigserial NOT NULL,
	name character varying(255),
	CONSTRAINT users_pkey PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS portfolios
(
	id bigserial NOT NULL,
	user_id bigint,
	name character varying(255),
	CONSTRAINT portfolios_pkey PRIMARY KEY(id)
);

-- dummy data to get us started
DELETE FROM products;
INSERT INTO products (id, name, rate_label, time_unit, volume_label, price_unit)
VALUES
(0, 'baseload', 'MW', 'h', 'MWh', '£'),
(1, 'peak', 'MW', 'h', 'MWh', '£');

DELETE FROM contracts;
INSERT INTO contracts (id, name, start_date, end_date, time_amount)
VALUES
-- note that end dates are exclusive, i.e. treated as ending at 00:00 hours on the specified dates
(0, 'Jan-16', '2016-01-04', '2016-02-01', 672),
(1, 'Feb-16', '2016-02-01', '2016-02-29', 672),
(2, 'Mar-16', '2016-02-29', '2016-04-04', 840),
(3, 'Q1-16',  '2016-01-04', '2016-04-04', 2184);

DELETE FROM users;
INSERT INTO users (id, name)
VALUES
(0, 'Powerisk');

DELETE FROM portfolios;
INSERT INTO portfolios (user_id, name)
VALUES
(0, 'Portfolio A'),
(0, 'Portfolio B'),
(0, 'Portfolio C'),
(0, 'Portfolio D');

DELETE FROM trades;
INSERT INTO trades (portfolio_id, product_id, contract_id, rate_amount, price, trade_date, info)
VALUES
(0,0,0,10,54.75,'2014-06-24','test'),
(0,0,0,10,53.6,'2014-07-10','test'),
(0,0,0,10,55.4,'2014-07-24','test'),
(0,0,0,10,56.15,'2014-09-16','test'),
(0,0,0,10,51.66,'2014-12-18','test'),
(0,0,0,20,47.15,'2015-01-14','test'),
(0,0,0,20,45.86,'2015-06-17','test'),
(0,0,0,15,43.79,'2015-09-16','test');



