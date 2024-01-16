const reducer = (state, {type, payload}) => {
    switch(type){
        case "employee_number":
            return {...state, employee_number: payload}
        case "password":
            return {...state, password: payload}
        case "image":
            return {...state, image: payload}
        case "alert":
            return {...state, alert: !state.alert}
        case "valid":
            return {...state, valid: Boolean(payload)}
        case "empty_employee_number":
            return {...state, empty_employee_number: Boolean(payload)}
        case "empty_password":
            return {...state, empty_password: Boolean(payload)}
        case "checked":
            return {...state, checked: Boolean(payload)}
        default:
            return state
    }
}

export default reducer