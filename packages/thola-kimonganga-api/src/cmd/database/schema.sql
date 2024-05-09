DO $$ BEGIN IF NOT EXISTS (
	SELECT
		1
	FROM
		pg_type
	WHERE
		typname = 'subscription_package_type'
) THEN CREATE TYPE subscription_package_type AS ENUM (
	'MONTHLY-BASIC',
	'ANNUAL-BASIC',
	'MONTHLY-CLASSIC',
	'ANNUAL-CLASSIC',
	'MONTHLY-PREMIUM',
	'ANNUAL-PREMIUM'
);

END IF;

IF NOT EXISTS (
	SELECT 
		1
	FROM 
		pg_type
	WHERE
		typname = 'account_role'
) THEN CREATE TYPE account_role AS ENUM (
	'user',
	'pharmacist',
	'organisation',
	'admin'
);

END IF;

IF NOT EXISTS (
	SELECT
		1
	FROM
		pg_type
	WHERE
		typname = 'drug_dosage_form'
) THEN CREATE TYPE drug_dosage_form AS ENUM (
	'tablet',
	'capsule',
	'powder',
	'liquid',
	'inhalation',
	'injection',
	'other'
);

END IF;

END $$;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS subscription_packages (
	package_id UUID DEFAULT uuid_generate_v4(),
	package_type subscription_package_type UNIQUE NOT NULL,
	duration INTEGER NOT NULL,
	price INTEGER NOT NULL,
	PRIMARY KEY (package_id)
);

CREATE TABLE IF NOT EXISTS accounts (
	account_id UUID DEFAULT uuid_generate_v4(),
	username VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	role account_role DEFAULT 'user',
	PRIMARY KEY (account_id)
);

CREATE TABLE IF NOT EXISTS organisations (
	organisation_id UUID DEFAULT uuid_generate_v4(),
	account_id UUID NOT NULL REFERENCES accounts(account_id),
	name VARCHAR(255) NOT NULL,
	created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_on TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY (organisation_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
	subscription_id UUID DEFAULT uuid_generate_v4(),
	package_id UUID NOT NULL REFERENCES subscription_packages(package_id),
	organisation_id UUID NOT NULL REFERENCES organisations(organisation_id),
	start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	end_date TIMESTAMP WITH TIME ZONE NOT NULL,
	expired BOOLEAN,
	PRIMARY KEY (subscription_id)
);

CREATE TABLE IF NOT EXISTS sessions (
	id SERIAL, 
	session_key VARCHAR(255) NOT NULL UNIQUE,
	account_id UUID REFERENCES accounts(account_id),
	start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	end_time TIMESTAMP WITH TIME ZONE NOT NULL,
	ip_address VARCHAR(39) NOT NULL,
	user_agent VARCHAR(255) NOT NULL,
	PRIMARY KEY (session_key)
);

CREATE TABLE IF NOT EXISTS pharmacies (
	pharmacy_id UUID DEFAULT uuid_generate_v4(),
	organisation_id UUID NOT NULL REFERENCES organisations(organisation_id),
	name VARCHAR(255) NOT NULL,
	created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_on TIMESTAMP WITH TIME ZONE,
	is_active BOOLEAN NOT NULL DEFAULT FALSE,
	geo_location GEOGRAPHY(POINT, 4326) NOT NULL,
	country VARCHAR(255) NOT NULL DEFAULT 'Cameroon',
	region VARCHAR(255) NOT NULL,
	city VARCHAR(255) NOT NULL,
	address VARCHAR(255) NOT NULL,
	PRIMARY KEY (pharmacy_id)
);

CREATE TABLE IF NOT EXISTS api_credentials (
	id UUID DEFAULT uuid_generate_v4(),
	public_key VARCHAR(255) NOT NULL,
	private_key VARCHAR(255) NOT NULL,
	created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
	organisation_id UUID NOT NULL REFERENCES organisations(organisation_id),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pharmacists (
	pharmacist_id UUID DEFAULT uuid_generate_v4(),
	pharmacy_id UUID NOT NULL REFERENCES pharmacies(pharmacy_id),
	account_id UUID NOT NULL REFERENCES accounts(account_id),
	phone_number VARCHAR(255) NOT NULL,
	joined_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_on TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY (pharmacist_id)
);

CREATE TABLE IF NOT EXISTS users (
	user_id UUID DEFAULT uuid_generate_v4(),
	account_id UUID NOT NULL REFERENCES accounts(account_id),
	PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS drugs (
	drug_id UUID DEFAULT uuid_generate_v4(),
	pharmacy_id UUID NOT NULL REFERENCES pharmacies(pharmacy_id),
	name VARCHAR(255) NOT NULL,
	description VARCHAR(255) NOT NULL,
	manufacturer VARCHAR(255) NOT NULL,
	expiry_date DATE NOT NULL,
	created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_on TIMESTAMP WITH TIME ZONE,
	category VARCHAR(255) NOT NULL,
	strength VARCHAR(255) NOT NULL,
	dosage_form drug_dosage_form NOT NULL,
	instructions VARCHAR(255),
	storageConditions VARCHAR(255),
	PRIMARY KEY (drug_id)
);

CREATE TABLE IF NOT EXISTS drug_stocks (
	stock_id UUID DEFAULT uuid_generate_v4(),
	drug_id UUID NOT NULL REFERENCES drugs(drug_id),
	quantity INTEGER NOT NULL DEFAULT 0,
	price NUMERIC(10, 5) NOT NULL,
	PRIMARY KEY (stock_id, drug_id)
);

CREATE TABLE IF NOT EXISTS transactions (
	transaction_id UUID DEFAULT uuid_generate_v4(),
	pharmacist_id UUID NOT NULL REFERENCES pharmacists(pharmacist_id),
	timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	PRIMARY KEY (transaction_id)
);

CREATE TABLE IF NOT EXISTS transaction_drugs (
	transaction_drug_id UUID DEFAULT uuid_generate_v4(),
	transaction_id UUID NOT NULL REFERENCES transactions(transaction_id),
	drug_id UUID NOT NULL REFERENCES drugs(drug_id),
	drug_qty INTEGER NOT NULL,
	price NUMERIC(10, 5) NOT NULL,
	PRIMARY KEY (transaction_drug_id)
);

CREATE TABLE IF NOT EXISTS search_history (
	search_id UUID DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL REFERENCES users(user_id),
	search_record_id UUID NOT NULL REFERENCES drugs(drug_id),
	clicked_record_id UUID NOT NULL REFERENCES drugs(drug_id),
	date TIMESTAMP WITH TIME ZONE NOT NULL,
	search_term VARCHAR(255),
	PRIMARY KEY (search_id)
);

CREATE TABLE IF NOT EXISTS email_confirmation_codes (
	code VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
	PRIMARY KEY (code, email)
);

CREATE TABLE IF NOT EXISTS admins (
	admin_id UUID DEFAULT uuid_generate_v4(),
	account_id UUID NOT NULL REFERENCES accounts(account_id),
	PRIMARY KEY (admin_id)
);

ALTER TABLE organisations DROP CONSTRAINT IF EXISTS fk_organisation_id;
ALTER TABLE pharmacies DROP CONSTRAINT IF EXISTS fk_pharmacy_id;
ALTER TABLE pharmacists DROP CONSTRAINT IF EXISTS fk_pharmacist_id;
ALTER TABLE organisations ADD CONSTRAINT fk_organisation_id FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE;
ALTER TABLE pharmacies ADD CONSTRAINT fk_pharmacy_id FOREIGN KEY (pharmacy_id) REFERENCES organisations(organisation_id) ON DELETE CASCADE;
ALTER TABLE pharmacists ADD CONSTRAINT fk_pharmacist_id FOREIGN KEY (pharmacist_id) REFERENCES accounts(account_id) ON DELETE CASCADE;
