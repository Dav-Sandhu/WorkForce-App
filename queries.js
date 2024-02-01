const sql = require('mssql')

//All SQL queries are stored here
const queries = (type, values) => {
    switch(type){
      case "find-employee":
        return {
          query: `
            USE WorkForce; 

            SELECT * 
            FROM employee 
            WHERE employee_number=@employee_number 
            AND password=@password;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'password', type: sql.VarChar, value: values[1] }
          ]
        }
      case "update password":
          return {
            query: `
              USE WorkForce; 
              
              UPDATE employee
              SET password=@password
              WHERE email=@email;
            `,
            parameters: [
              { name: 'email', type: sql.VarChar, value: values[0] },
              { name: 'password', type: sql.VarChar, value: values[1] }
            ]
          }
      case "employee-number":
        return {
          query: `
            USE WorkForce; 

            SELECT * 
            FROM employee 
            WHERE employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]
        }
      case "picture":
        return {
          query: `
            USE WorkForce; 

            SELECT picture, employee_number 
            FROM employee;
          `,
          parameters: []
        }
      case "update-picture":
        return {
          query: `
            USE WorkForce;

            UPDATE employee
            SET picture=@picture
            WHERE employee_number=@employee_number;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'picture', type: sql.VarChar, value: values[1] }
          ]
        }
      case "check-clocked-in":
        return{
          query: `
            USE WorkForce; 

            SELECT clock_in
            FROM clock 
            WHERE clock_out IS NULL
            AND employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]  
        }
      case "get-clock":
        return{
          query: `
            USE WorkForce;

            SELECT *
            FROM clock
            WHERE CONVERT(DATE, @date) = CONVERT(DATE, clock_in);
          `,
          parameters: [{ name: 'date', type: sql.Date, value: values[0] }]
        }
      case "clock-in":
        return{
          query: `
            USE WorkForce;

            DECLARE @current_date DATETIME
            SET @current_date = GETUTCDATE()

            INSERT INTO clock(employee_number, clock_in, clock_out)
            VALUES (@employee_number, @current_date, NULL); 
            
            SELECT @current_date AS clock_in;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]  
        }
      case "clock-out":
        return{
          query: `
            USE WorkForce;

            UPDATE clock
            SET clock_out=GETUTCDATE()
            WHERE clock_out IS NULL
            AND employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]  
        }
      case "start-time-off":
        return{
          query: `
            USE WorkForce;

            DECLARE @current_date DATETIME
            SET @current_date = GETUTCDATE()

            INSERT INTO timeoff(employee_number, break_type, start, finish)
            VALUES(@employee_number, @break_type, @current_date, NULL);

            SELECT @current_date AS start;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'break_type', type: sql.Char, value: values[1] }
          ]
        }
      case "finish-time-off":
        return{
          query: `
            USE WorkForce;

            UPDATE timeoff
            SET finish=GETUTCDATE()
            WHERE employee_number=@employee_number
            AND start=@start;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'start', type: sql.DateTime, value: values[1] }
          ]
        }
      case "delete-time-off":
        return{
          query: `
            USE WorkForce;

            DELETE FROM timeoff
            WHERE employee_number=@employee_number
            AND break_type=@break_type
            AND start=@start;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'break_type', type: sql.Char, value: values[1] },
            { name: 'start', type: sql.DateTime, value: values[2] }
          ]
        }
      case "get-timeoff":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM timeoff
            WHERE employee_number=@employee_number
            AND finish IS NULL;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]
        }
      case "get-all-timeoff":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM timeoff
            WHERE employee_number=@employee_number
            AND CONVERT(DATE, @date) = CONVERT(DATE, start);
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'date', type: sql.Date, value: values[1] }
          ]
        }
      case "start-process":
        return{
          query: `
            USE WorkForce;

            DECLARE @current_date DATETIME
            SET @current_date = GETUTCDATE()

            INSERT INTO work(employee_number, process_type, business_name, contact_email, start, finish)
            VALUES(@employee_number, @process_type, @business_name, @contact_email, @current_date, NULL);
          
            SELECT @current_date AS start;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'process_type', type: sql.VarChar, value: values[1] },
            { name: 'business_name', type: sql.VarChar, value: values[2] },
            { name: 'contact_email', type: sql.VarChar, value: values[3] }
          ]
        }
      case "finish-process":
        return{
          query: `
            USE WorkForce;

            DECLARE @current_date DATETIME
            SET @current_date = GETUTCDATE()

            UPDATE work
            SET finish=@current_date
            WHERE employee_number=@employee_number
            AND process_type=@process_type
            AND business_name=@business_name
            AND contact_email=@contact_email
            AND start=@start;

            SELECT @current_date;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'process_type', type: sql.VarChar, value: values[1] },
            { name: 'business_name', type: sql.VarChar, value: values[2] },
            { name: 'contact_email', type: sql.VarChar, value: values[3] },
            { name: 'start', type: sql.DateTime, value: values[4] }
          ]
        }
      case "delete-process":
        return{
          query: `
            USE WorkForce;

            DELETE FROM work
            WHERE employee_number=@employee_number
            AND process_type=@process_type
            AND business_name=@business_name
            AND contact_email=@contact_email
            AND start=@start;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'process_type', type: sql.VarChar, value: values[1] },
            { name: 'business_name', type: sql.VarChar, value: values[2] },
            { name: 'contact_email', type: sql.VarChar, value: values[3] },
            { name: 'start', type: sql.DateTime, value: values[4] }
          ]
        }
      case "get-unfinished-processes":
        return{
          query: `
            USE WorkForce;

            SELECT * 
            FROM work
            WHERE finish IS NULL
            AND employee_number=@employee_number
            ORDER BY start;
          `, 
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]
        }
      case "delete-employee":
        return{
          query: `
            USE WorkForce;

            DELETE FROM clock 
            WHERE employee_number=@employee_number;

            DELETE FROM work 
            WHERE employee_number=@employee_number;

            DELETE FROM timeoff
            WHERE employee_number=@employee_number;

            DELETE FROM employee
            WHERE employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]
        }
      case "check-process":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM work
            WHERE employee_number=@employee_number
            AND process_type=@process_type
            AND business_name=@business_name
            AND contact_email=@contact_email
            ORDER BY start;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'process_type', type: sql.VarChar, value: values[1] },
            { name: 'business_name', type: sql.VarChar, value: values[2] },
            { name: 'contact_email', type: sql.VarChar, value: values[3] }
          ]
        }
      case "get-process":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM work
            WHERE employee_number=@employee_number
            AND CONVERT(DATE, @date) = CONVERT(DATE, start);
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'date', type: sql.Date, value: values[1] }
          ]
        }
      case "get-internal-processes":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM internal_process;
          `,
          parameters: []
        }
      case "delete-internal-process":
        return{
          query: `
            USE WorkForce;

            DELETE FROM work
            WHERE process_type=@process_type;

            DELETE FROM internal_process
            WHERE process_type=@process_type;
          `,
          parameters: [{ name: 'process_type', type: sql.VarChar, value: values[0] }]
        }
      case "add-internal-process":
        return{
          query: `
            USE WorkForce;

            INSERT INTO internal_process(process_type, billable, hourly_rate)
            VALUES(@process_type, @billable, @hourly_rate);
          `,
          parameters: [
            { name: 'process_type', type: sql.VarChar, value: values[0] },
            { name: 'billable', type: sql.Bit, value: values[1] },
            { name: 'hourly_rate', type: sql.Float, value: values[2] }
          ]
        }
      case "update-employee-wage":
        return{
          query: `
            USE WorkForce;

            UPDATE employee
            SET hourly_wage=@hourly_wage
            WHERE employee_number=@employee_number;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'hourly_wage', type: sql.Float, value: values[1]}
          ]
        }
      case "facematch":
        return{
          query: `
            USE WorkForce; 
            
            SELECT * 
            FROM employee 
            WHERE picture=@picture;
          `,
          parameters: [{ name: 'picture', type: sql.VarChar, value: values[0] }]
        }
      case "email":
        return{
          query: `
            USE WorkForce; 

            SELECT * 
            FROM employee 
            WHERE email=@email;
          `,
          parameters: [{name: 'email', type: sql.VarChar, value: values[0]}]
        }
      case "get-jobs":
        return{
          query: `
            USE WorkForce; 

            SELECT process_type FROM internal_process;
          `,
          parameters: []
        }
      case "get-customers":
        return{
          query: `
            USE WorkForce;
            
            SELECT * FROM customers;
          `,
          parameters: []
        }
      case "add-customer":
        return{
          query: `
            USE WorkForce;

            INSERT INTO customers(business_name, currency, contact_name, contact_email, logo)
            VALUES(@business_name, @currency, @contact_name, @contact_email, @logo);
          `,
          parameters: [
            { name: 'business_name', type: sql.VarChar, value: values[0] },
            { name: 'currency', type: sql.Char, value: values[1] },
            { name: 'contact_name', type: sql.VarChar, value: values[2] },
            { name: 'contact_email', type: sql.VarChar, value: values[3] },
            { name: 'logo', type: sql.VarChar, value: values[4] }
          ]
        }
      case "delete-customer":
        return{
          query: `
            USE WorkForce;

            DELETE FROM work
            WHERE business_name=@business_name
            AND contact_email=@contact_email;

            DELETE FROM customers
            WHERE business_name=@business_name
            AND contact_email=@contact_email;
          `,
          parameters: [
            { name: 'business_name', type: sql.VarChar, value: values[0] },
            { name: 'contact_email', type: sql.VarChar, value: values[1] }
          ]
        }
      case "get-employees":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM employee
            WHERE is_admin=0; 
          `,
          parameters: []
        }
      case "update-wage":
        return{
          query: `
            USE WorkForce;

            UPDATE employee
            SET hourly_wage=@hourly_wage
            WHERE employee_number=@employee_number;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'hourly_wage', type: sql.Float, value: values[1] }
          ]
        }
      case "add-employee":
        return{
          query: `
            USE WorkForce;
            
            BEGIN
              IF NOT EXISTS(SELECT * FROM employee WHERE employee_number=@employee_number)
              BEGIN
                INSERT INTO employee(first_name, last_name, employee_number, email, password, hourly_wage, picture, is_admin)
                VALUES(@first_name, @last_name, @employee_number, @email, @password, @hourly_wage, @picture, @is_admin);
              END
            END

            SELECT * FROM employee WHERE employee_number=@employee_number;
          `,
          parameters: [
            { name: 'first_name', type: sql.VarChar, value: values[0] },
            { name: 'last_name', type: sql.VarChar, value: values[1] },
            { name: 'employee_number', type: sql.Char, value: values[2]},
            { name: 'email', type: sql.VarChar, value: values[3] },
            { name: 'password', type: sql.VarChar, value: values[4] },
            { name: 'hourly_wage', type: sql.Float, value: values[5] },
            { name: 'picture', type: sql.VarChar, value: values[6] },
            { name: 'is_admin', type: sql.Bit, value: values[7]}
          ]
        }
      case "generate-employee-number":
        return{
          query: `
            USE WorkForce;

            WITH CTE AS (
              SELECT FLOOR(RAND() * 1000) AS rn
              UNION ALL
              SELECT s.rn
              FROM (
                SELECT rn
                FROM CTE
                WHERE rn NOT IN (SELECT employee_number FROM employee)
              ) t
              CROSS JOIN (SELECT FLOOR(RAND() * 1000) AS rn) AS s
              WHERE t.rn IS NULL
            )
            
            SELECT FORMAT(rn, '000') AS rn FROM CTE;
          `,
          parameters: []
        }
      case "remove-employee":
        return{
          query: `
            USE WorkForce; 
            
            DELETE FROM employee 
            WHERE employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]
        }
      default:
        return
    }
}

module.exports = queries