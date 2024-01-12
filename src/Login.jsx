import FaceScanner from "./FaceScanner"

import { makeRequest } from "./useDB"
import { useReducer, useRef } from "react"
import { useNavigate } from "react-router-dom"

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
            return {...state, valid: !state.valid}
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

const Login = () => {

    const [state, dispatch] = useReducer(reducer, {
        employee_number: '',
        password: localStorage.getItem('password') !== null ? localStorage.getItem('password') : "",
        image: null,
        alert: false,
        valid: true,
        empty_employee_number: true,
        empty_password: true
    })

    const handleUpdate = (e) => {
        dispatch({
            type: e.target.id,
            payload: e.target.value
        })
    }

    const password_box = useRef(null)
    const employee_number_box = useRef(null)

    const navigate = useNavigate()

    return(
        <div className="login container">
            <h1 className='fw-bold fs-25 mb-1 text-center text-info title'>WorkForce Login</h1>
            {
                state.alert ? 
                <div className="alert alert-danger alert-dismissible" role="alert">Warning: Missing Fields
                    <button 
                        className="btn-close"
                        aria-label="close"
                        data-bs-dismiss="alert"
                        onClick={(e) => {dispatch({type: "alert"})}}
                    ></button>
                </div> : ""
            }
            <form 
                className={state.valid ? "" : "was-validated"}
                noValidate
                onSubmit={(e) => {
                    e.preventDefault()

                    const checkInfo = async () => {

                        const out = await makeRequest(JSON.stringify({ 
                            type: "find-employee", 
                            values: [state.employee_number, state.password] 
                        }))
                        
                        if (state.valid && out.length > 0 
                            && employee_number_box.current.className.includes("is-valid") 
                            && password_box.current.className.includes("is-valid") ){

                            //saves password if box is checked
                            state.checked ? localStorage.setItem('password', state.password) : ""
                            
                            navigate('/Tasks')
                        }else{
                            alert("Login attempt failed!")
                        }
                    }

                    checkInfo()
            }}>
                <div className="input-group mb-4">
                    <div className="form-floating">
                        <input
                            id="employee_number"
                            className={state.empty_employee_number ? "form-control" : state.employee_number.length > 0 ? "form-control is-valid" : "form-control is-invalid"} 
                            type="text"
                            ref={employee_number_box}
                            placeholder="Employee Number" 
                            value={state.employee_number}
                            onChange={(e) => {
                                handleUpdate(e)

                                dispatch({
                                    type: "empty_employee_number",
                                    payload: false
                                })
                            }} 
                            required 
                        />
                        <label htmlFor="employee_number">Employee Number: </label>
                        <div className="invalid-feedback user-invalid">Invalid input</div>
                    </div>
                </div>

                <div className="form-floating mb-4">
                    <input
                        id="password" 
                        className={state.empty_password ? "form-control" : state.password.length > 0 ? "form-control is-valid" : "form-control is-invalid"} 
                        type="password"
                        ref={password_box}
                        placeholder="Password"
                        value={state.password}
                        onChange={(e) => {
                            handleUpdate(e)

                            dispatch({
                                type: "empty_password",
                                payload: false
                            })
                        }} 
                        required 
                    />
                    <label htmlFor="password">Password: </label>
                    <div className="invalid-feedback">Invalid input</div>
                </div>

                <div className="mb-4">
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            value="" 
                            id="savePassword"
                            onChange={(e) => {
                                dispatch({
                                    type: "checked",
                                    payload: e.target.checked
                                })
                            }} 
                        />

                        <label className="form-check-label" htmlFor="savePassword">
                            Remember Password
                        </label>
                    </div>
                </div>
                
                <input className="btn btn-outline-primary"  type="submit" value="Login" />
            </form>

            <a className="mb-4" href="#!">Forgot password?</a>
            <p>Not a member? <a href="/register">Register</a></p>

            <FaceScanner 
                state={state} 
                dispatch={dispatch}
                makeRequest={makeRequest}
                navigate={navigate} 
            />
        </div>
    )
}

export default Login