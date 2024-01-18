const reducer = (state, {type, payload}) => {
    switch(type){
        case "employee_number":
            return {...state, employee_number: payload}
        case "password":
            return {...state, password: payload}
        case "repeat_password":
            return {...state, repeat_password: payload}
        case "first_name":
            return {...state, first_name: payload}
        case "last_name":
            return {...state, last_name: payload}
        case "email":
            return {...state, email: payload}
        case "hourly_wage":
            return {...state, hourly_wage: parseFloat(payload)}
        case "picture":
            return {...state, picture: payload}
        default:
            return state
    }
}

export default reducer