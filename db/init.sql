
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
	product_id bigint,
	contract_id bigint,
	rate_amount double precision,
	price double precision,
	info character varying(255),
	CONSTRAINT trades_pkey PRIMARY KEY (id)
);

-- dummy data to get us started
DELETE FROM products;
INSERT INTO products (name, rate_label, time_unit, volume_label, price_unit)
VALUES
('baseload', 'MW', 'h', 'MWh', '£'),
('peak', 'MW', 'h', 'MWh', '£');

DELETE FROM contracts;
INSERT INTO contracts (name, start_date, end_date, time_amount)
VALUES
-- note that end dates are exclusive, i.e. treated as ending at 00:00 hours on the specified dates
('Jan-16', '2016-01-04', '2016-02-01', 672),
('Feb-16', '2016-02-01', '2016-02-29', 672),
('Mar-16', '2016-02-29', '2016-04-04', 840),
('Q1-16',  '2016-01-04', '2016-04-04', 2184);


