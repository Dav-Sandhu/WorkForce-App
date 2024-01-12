import { makeRequest } from "./useDB"
import FaceScanner from "./FaceScanner"
import { useReducer } from "react"
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
        case "valid_employee_number":
            return {...state, valid_employee_number: !state.valid_employee_number}
        case "valid_password":
            return {...state, valid_password: !state.valid_password}
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
        valid_employee_number: true,
        valid_password: true
    })

    const handleUpdate = (e) => {
        dispatch({
            type: e.target.id,
            payload: e.target.value
        })
    }

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

                        /*
                            query will go through database to see if the employee exists based on the 
                            given information and will return a list of all places it matches.
                        */
                        const out = await makeRequest(JSON.stringify({ 
                            type: "find-employee", 
                            values: [state.employee_number, state.password] 
                        }))
                        
                        
                        if (state.valid && out.length >= 1){

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
                            className={state.valid_employee_number ? "form-control" : ""} 
                            type="text"
                            placeholder="Employee Number" 
                            value={state.employee_number}
                            onChange={(e) => {handleUpdate(e)}} 
                            required 
                        />
                        <label htmlFor="employee_number">Employee Number: </label>
                        <div className="invalid-feedback user-invalid">Invalid input</div>
                    </div>
                </div>

                <div className="form-floating mb-4">
                    <input
                        id="password" 
                        className={state.valid_password ? "form-control" : ""} 
                        type="password"
                        placeholder="Password"
                        value={state.password}
                        onChange={(e) => {handleUpdate(e)}} 
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