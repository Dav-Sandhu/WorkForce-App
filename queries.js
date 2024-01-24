const { TYPES } = require("tedious")

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
            AND password=@password;`,
          parameters: [
            { name: 'employee_number', type: TYPES.VarChar, value: values[0] },
            { name: 'password', type: TYPES.VarChar, value: values[1] }
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
              { name: 'email', type: TYPES.VarChar, value: values[0] },
              { name: 'password', type: TYPES.VarChar, value: values[1] }
            ]
          }
      case "employee-number":
        return {
          query: `
            USE WorkForce; 

            SELECT * 
            FROM employee 
            WHERE employee_number=@employee_number;`,
          parameters: [{ name: 'employee_number', type: TYPES.VarChar, value: values[0] }]
        }
      case "picture":
        return {
          query: `
            USE WorkForce; 

            SELECT picture, employee_number 
            FROM employee;`,
          parameters: []
        }
      case "check-clocked-in":
        return{
          query: `
            USE WorkForce; 

            SELECT clock_in, clock_out 
            FROM clock 
            WHERE date=CONVERT(DATE, GETUTCDATE()) 
            AND employee_number=@employee_number;`,
          parameters: [{ name: 'employee_number', type: TYPES.VarChar, value: values[0] }]  
        }
      case "check-clocked-out":
        return{
          query: `
            USE WorkForce;

            SELECT date
            FROM clock
            WHERE clock_out=NULL 
            AND employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: TYPES.VarChar, value: values[0] }]
        }
      case "clock-in":
        return{
          query: `
            USE WorkForce;

            INSERT INTO clock(employee_number, clock_in, clock_out, date)
            VALUES (@employee_number, GETUTCDATE(), NULL, CONVERT(DATE, GETUTCDATE())); 
            
            SELECT clock_in, clock_out FROM clock WHERE date=CONVERT(DATE, GETUTCDATE()) 
            AND employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: TYPES.VarChar, value: values[0] }]  
        }
      case "clock-out":
        return{
          query: `
            USE WorkForce;

            UPDATE clock
            SET clock_out=GETUTCDATE()
            WHERE date=CONVERT(DATE, GETUTCDATE()) 
            AND employee_number=@employee_number;

            SELECT clock_in, clock_out FROM clock 
            WHERE date=CONVERT(DATE, GETUTCDATE()) 
            AND employee_number=@employee_number;
          `,
          parameters: [{ name: 'employee_number', type: TYPES.VarChar, value: values[0] }]  
        }
      case "facematch":
        return{
          query: `
            USE WorkForce; 
            
            SELECT * 
            FROM employee 
            WHERE picture=@picture`,
          parameters: [{ name: 'picture', type: TYPES.VarChar, value: values[0] }]
        }
      case "daily-report":
        return{
          query: `
            USE WorkForce; 

            SELECT * 
            FROM daily_report`,
          parameters: []
        }
      case "email":
        return{
          query: `
            USE WorkForce; 

            SELECT * 
            FROM employee 
            WHERE email=@email`,
          parameters: [{name: 'email', type: TYPES.VarChar, value: values[0]}]
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
      case "add-employee":
        return{
          query: `
          USE WorkForce;
          
          BEGIN
            IF NOT EXISTS(SELECT * FROM employee WHERE employee_number=@employee_number)
            BEGIN
              INSERT INTO employee(first_name, last_name, employee_number, email, password, hourly_wage, picture)
              VALUES(@first_name, @last_name, @employee_number, @email, @password, @hourly_wage, @picture);
            END
          END

          SELECT * FROM employee WHERE employee_number=@employee_number;
          `,
          parameters: [
            { name: 'first_name', type: TYPES.VarChar, value: values[0] },
            { name: 'last_name', type: TYPES.VarChar, value: values[1] },
            { name: 'employee_number', type: TYPES.VarChar, value: values[2]},
            { name: 'email', type: TYPES.VarChar, value: values[3] },
            { name: 'password', type: TYPES.VarChar, value: values[4] },
            { name: 'hourly_wage', type: TYPES.Float, value: values[5] },
            { name: 'picture', type: TYPES.VarChar, value: values[6] }
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
            WHERE employee_number=@employee_number;`,
          parameters: [{ name: 'employee_number', type: TYPES.VarChar, value: values[0] }]
        }
      default:
        return
    }
}

module.exports = queries