const { TYPES } = require("tedious")

//creates a limited set of actions that the front-end can do in order to prevent a potential sql injection attack
const queries = (type, values) => {
    switch(type){
      case "find-employee":
        return {
          query: `USE WorkForce; SELECT * FROM employee WHERE employee_number=@employee_number AND password=@password`,
          parameters: [
            { name: 'employee_number', type: TYPES.Int, value: parseInt(values[0] !== NaN ? parseInt(values[0]) : -1) },
            { name: 'password', type: TYPES.VarChar, value: values[1] }
          ]
        }
      case "picture":
        return {
          query: `USE WorkForce; SELECT picture FROM employee;`,
          parameters: []
        }
      case "daily-report":
        return{
          query: `USE WorkForce; SELECT * FROM daily_report`,
          parameters: []
        }
      case "email":
        return{
          query: `USE WorkForce; SELECT * FROM employee WHERE email=@email`,
          parameters: [{name: 'email', type: TYPES.VarChar, value: values[0]}]
        }
      default:
        return
    }
}

module.exports = queries