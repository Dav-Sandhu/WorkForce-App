const reducer = (state, {type, payload}) => {
    switch(type){
        case "employee_number":
            return {...state, employee_number: payload}
        case "email":
            return {...state, email: payload}
        case "adp_number":
            return {...state, adp_number: payload}
        case "password":
            return {...state, password: payload}
        case "image":
            return {...state, image: payload}
        case "alert":
            return {...state, alert: !state.alert}
        case "valid":
            return {...state, valid: Boolean(payload)}
        case "empty_email":
            return {...state, empty_email: Boolean(payload)}
        case "empty_password":
            return {...state, empty_password: Boolean(payload)}
        case "checked":
            return {...state, checked: Boolean(payload)}
        case "reset_password":
            return {...state, reset_password: !state.reset_password}
        default:
            return state
    }
}

export default reducer