import { useReducer, useRef, useEffect, lazy } from "react"
import { useNavigate } from "react-router-dom"

const FaceScanner = lazy(() => import('../FaceScanner/FaceScanner'))

import { useUserInfo } from "../UserProvider"

import reducer from "./Reducer"

const Login = () => {

    const password_box = useRef(null)
    const employee_number_box = useRef(null)

    const user = useUserInfo()

    const [state, dispatch] = useReducer(reducer, {
        employee_number: '',
        password: localStorage.getItem('password') || '',
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

    useEffect(() => {
        if(employee_number_box.current.className.includes("is-invalid") || 
        password_box.current.className.includes("is-invalid")){
            dispatch({
                type: "valid",
                payload: false
            })
        }else{
            dispatch({
                type: "valid",
                payload: true
            })
        }
        
    }, [state.employee_number, state.password])

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
                        onClick={() => {dispatch({type: "alert"})}}
                    ></button>
                </div> : ""
            }
            <form 
                className={state.valid ? "" : "was-validated"}
                noValidate
                onSubmit={(e) => {
                    e.preventDefault()

                    const checkInfo = async () => {

                        const module = await import('../useDB')
                        const makeRequest = module.makeRequest

                        try{
                            const token = await makeRequest(
                                {
                                    type: "find-employee", 
                                    values: [state.employee_number, state.password] 
                                },
                                '/authenticate',
                                null
                            )
                                    
                            sessionStorage.setItem('token', token.token)
                            const token_decoded = await makeRequest(null, '/userinfo', token)
                            
                            if(token_decoded.length > 0){
                                user.setUserInfo({
                                    employee_number: token_decoded[0].employee_number,
                                    first_name: token_decoded[0].first_name,
                                    last_name: token_decoded[0].last_name,
                                    email: token_decoded[0].email,
                                    password: token_decoded[0].password,
                                    hourly_wage: token_decoded[0].hourly_wage,
                                    picture: token_decoded[0].picture
                                })
                                
                                state.checked ? localStorage.setItem('password', state.password) : ""
                            
                                navigate('/')
                            }else{alert("Something went wrong...")}
                            
                        }catch(e){
                            !state.valid ? dispatch({type: "alert"}) : alert("Login attempt failed, please make sure your information is correct!")
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
                navigate={navigate} 
                user={user}
            />
        </div>
    )
}

export default Login