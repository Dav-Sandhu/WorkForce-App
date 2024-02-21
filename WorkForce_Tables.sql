USE WorkForce;

CREATE TABLE employee(
	first_name VARCHAR(255), 
	last_name VARCHAR(255),
	employee_number CHAR(3),
	email VARCHAR(255),
	password VARCHAR(255),
	hourly_wage FLOAT,
	picture VARCHAR(255),
	is_admin BIT,
	is_supervisor BIT,
	PRIMARY KEY(employee_number)
);

CREATE TABLE requests(
	employee_number CHAR(3) PRIMARY KEY,
	FOREIGN KEY(employee_number) REFERENCES employee(employee_number)
);
CREATE TABLE internal_process(
	process_type VARCHAR(255),
	billable BIT NOT NULL,
	hourly_rate FLOAT,
	PRIMARY KEY(process_type)
);

CREATE TABLE customers(
	business_name VARCHAR(255),
	currency CHAR(3),
	contact_name VARCHAR(255),
	contact_email VARCHAR(255),
	logo VARCHAR(255),
	PRIMARY KEY(business_name, contact_email)
);

CREATE TABLE clock(
	employee_number CHAR(3),
	clock_in  DATETIME,
	clock_out DATETIME, 
	PRIMARY KEY(employee_number, clock_in),
	FOREIGN KEY (employee_number) REFERENCES employee(employee_number)
);

CREATE TABLE work (
  employee_number CHAR(3),
  process_type VARCHAR(255),
  business_name VARCHAR(255),
  contact_email VARCHAR(255),
  start DATETIME,
  finish DATETIME,
  PRIMARY KEY (employee_number, process_type, business_name, contact_email, start),
  FOREIGN KEY (business_name, contact_email) REFERENCES customers(business_name, contact_email),
  FOREIGN KEY (employee_number) REFERENCES employee(employee_number),
  FOREIGN KEY (process_type) REFERENCES internal_process(process_type)
);

CREATE TABLE timeoff(
	employee_number CHAR(3),
	break_type CHAR(5),
	start DATETIME,
	finish DATETIME,
	PRIMARY KEY(employee_number, start),
	FOREIGN KEY(employee_number) REFERENCES employee(employee_number)
);

CREATE TABLE assign(
	employee_number CHAR(3),
	process_type VARCHAR(255),
	PRIMARY KEY(employee_number, process_type),
	FOREIGN KEY(employee_number) REFERENCES employee(employee_number),
	FOREIGN KEY(process_type) REFERENCES internal_process(process_type)
);