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
      case "upgrade-user":
        return{
          query: `
            USE WorkForce;

            UPDATE employee
            SET is_supervisor=1
            WHERE employee_number=@employee_number;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] }
          ]
        }
      case "downgrade-user":
        return{
          query: `
            USE WorkForce;

            UPDATE employee
            SET is_supervisor=0
            WHERE employee_number=@employee_number;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] }
          ]
        }
      case "update-break-times":
        return{
          query: `
            USE WorkForce;

            UPDATE employee
            SET break_time=@break_time, lunch_time=@lunch_time
            WHERE employee_number=@employee_number;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'break_time', type: sql.Int, value: values[1] },
            { name: 'lunch_time', type: sql.Int, value: values[2] }
          ]
        }
      case "update-adp-number":
        return{
          query: `
            USE WorkForce;

            UPDATE employee
            SET adp_number=@adp_number
            WHERE employee_number=@employee_number;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'adp_number', type: sql.Char, value: values[1] }
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

            DECLARE @current_date DATETIME
            SET @current_date = GETUTCDATE()

            UPDATE work
            SET finish=@current_date
            WHERE employee_number=@employee_number
            AND finish IS NULL;

            UPDATE timeoff
            SET finish=@current_date
            WHERE employee_number=@employee_number
            AND finish IS NULL;

            UPDATE clock
            SET clock_out=@current_date
            WHERE clock_out IS NULL
            AND employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]  
        }
      case "get-clocks-range":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM clock
            WHERE clock_in BETWEEN @start AND DATEADD(day, 1, @finish);
          `,
          parameters: [
            { name: 'start', type: sql.Date, value: values[0] },
            { name: 'finish', type: sql.Date, value: values[1] }
          ]
        }
      case "get-time-off-range":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM timeoff
            WHERE start BETWEEN @start AND DATEADD(day, 1, @finish);
          `,
          parameters: [
            { name: 'start', type: sql.Date, value: values[0] },
            { name: 'finish', type: sql.Date, value: values[1] }
          ]
        }
      case "get-work-range":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM work
            WHERE start BETWEEN @start AND DATEADD(day, 1, @finish);
          `,
          parameters: [
            { name: 'start', type: sql.Date, value: values[0] },
            { name: 'finish', type: sql.Date, value: values[1] }
          ]
        }
      case "start-time-off":
        return{
          query: `
            USE WorkForce;

            DECLARE @current_date DATETIME
            SET @current_date = GETUTCDATE()

            UPDATE timeoff
            SET finish=@current_date
            WHERE employee_number=@employee_number
            AND finish IS NULL;

            UPDATE work
            SET finish=@current_date
            WHERE employee_number=@employee_number
            AND finish IS NULL;

            INSERT INTO timeoff(employee_number, break_type, start, finish)
            VALUES(@employee_number, @break_type, @current_date, NULL);

            SELECT @current_date AS start;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'break_type', type: sql.Char, value: values[1] }
          ]
        }
      case "auto-time-off-finish":
        return{
          query: `
            USE WorkForce;

            UPDATE timeoff
            SET finish=DATEADD(second, @seconds, start)
            WHERE employee_number = @employee_number
            AND finish IS NULL;
          `, 
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'seconds', type: sql.Int, value: values[1] } 
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
            WHERE CONVERT(DATE, @date) = CONVERT(DATE, start);
          `,
          parameters: [{ name: 'date', type: sql.Date, value: values[0] }]
        }
      case "get-all-employees":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM employee WHERE is_admin=0;
          `,
          parameters: []
        }
      case "start-process":
        return{
          query: `
            USE WorkForce;

            DECLARE @current_date DATETIME
            SET @current_date = GETUTCDATE()

            UPDATE work
            SET finish=@current_date
            WHERE employee_number=@employee_number
            AND finish IS NULL;

            UPDATE timeoff
            SET finish=@current_date
            WHERE employee_number=@employee_number
            AND finish IS NULL;

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

            DELETE FROM assign
            WHERE employee_number=@employee_number;

            DELETE FROM requests
            WHERE employee_number=@employee_number;

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
            WHERE CONVERT(DATE, @date) = CONVERT(DATE, start);
          `,
          parameters: [{ name: 'date', type: sql.Date, value: values[0] }]
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

            DELETE FROM assign
            WHERE process_type=@process_type;

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
      case "check-assign-job":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM assign
            WHERE employee_number=@employee_number
            AND process_type=@process_type;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'process_type', type: sql.VarChar, value: values[1] }
          ]
        }
      case "assign-job":
        return{
          query: `
            USE WorkForce;

            INSERT INTO assign(employee_number, process_type)
            VALUES(@employee_number, @process_type);
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'process_type', type: sql.VarChar, value: values[1] }
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

            SELECT process_type 
            FROM assign
            WHERE employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]
        }
      case "request-job":
        return{
          query: `
            USE WorkForce;

            INSERT INTO requests(employee_number)
            VALUES(@employee_number);
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]
        }
      case "delete-job-request":
        return{
          query: `
            USE WorkForce;

            DELETE FROM requests
            WHERE employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: sql.Char, value: values[0] }]
        }
      case "get-requests":
        return{
          query: `
            USE WorkForce;

            SELECT * FROM requests;
          `,
          parameters: []
        }
      case "delete-assigned-job":
        return{
          query: `
          USE WorkForce;

          DELETE FROM assign
          WHERE @employee_number=employee_number
          AND @process_type=process_type;
          `,
          parameters: [
            { name: 'employee_number', type: sql.Char, value: values[0] },
            { name: 'process_type', type: sql.VarChar, value: values[1] }
          ]
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
                INSERT INTO employee(first_name, last_name, employee_number, email, password, hourly_wage, picture, is_admin, is_supervisor, break_time, lunch_time)
                VALUES(@first_name, @last_name, @employee_number, @email, @password, @hourly_wage, @picture, @is_admin, @is_supervisor, 15, 30);
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
            { name: 'is_admin', type: sql.Bit, value: values[7]},
            { name: 'is_supervisor', type: sql.Bit, value: values[8] }
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