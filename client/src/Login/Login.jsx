import "./Login.scss"

import { useReducer, useState, useRef, useEffect, lazy } from "react"
import { useNavigate } from "react-router-dom"

//const FaceScanner = lazy(() => import('../FaceScanner/FaceScanner'))

import { useUserInfo } from "../UserProvider"
import ResetPassword from "./ResetPassword"

import reducer from "./LoginReducer"

const Login = () => {

    const password_box = useRef(null)
    const employee_number_box = useRef(null)

    const user = useUserInfo()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    /*
    if the session storage holds a valid token object, it will bypass the login screen, 
    to prevent the page going back to login upon refresh
    */
    useEffect(() => {

        const token = sessionStorage.getItem('token')

        if (token !== null){
            const request = async () => {
                const module = await import('../useDB')
                const tokenLogin = await import('../TokenLogin')

                const res = await tokenLogin.default(token, module.makeRequest, () => navigate('/'), user)

                if (res.status === -1){
                    sessionStorage.removeItem('token')
                    window.location.reload()
                }
            }

            request()

            setLoading(true)
        }
    }, [])

    //local state object to handle all of the state updates on this page
    const [state, dispatch] = useReducer(reducer, {
        employee_number: '',
        password: localStorage.getItem('password') || '',
        image: null,
        alert: false,
        valid: true,
        empty_employee_number: true,
        empty_password: true,
        reset_password: false
    })

    const handleUpdate = (e) => {
        dispatch({
            type: e.target.id,
            payload: e.target.value
        })
    }

    useEffect(() => {
        //this will let the user know if their input is valid or not (at least one character long)
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

    return(
        <>
            {loading ?                 
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                :
                <div className="login container">
                    <h1 className='fw-bold fs-25 mb-1 text-center text-info title'>WorkForce Login</h1>
                    {
                        //will let the user know that some fields are empty if they try to sign in without completing the form
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
        
                            //when form is submitted it will validate the information to make sure that the user exists in the database
                            const checkInfo = async () => {
        
                                const module = await import('../useDB')
                                const makeRequest = module.makeRequest
        
                                //looks for employee in database
                                const res = await makeRequest(
                                    {
                                        type: "find-employee", 
                                        values: [state.employee_number, state.password] 
                                    },
                                    '/authenticate',
                                    null
                                )

                                if (res.status === 1){

                                    const token = res.token
                                    
                                    //if found token will be temporarily stored in storage (valid ~1 hour or during current session)
                                    sessionStorage.setItem('token', token)
        
                                    //if save password is selected it will save the password to local storage for future reference
                                    state.checked ? localStorage.setItem('password', state.password) : ""
        
                                    //will decypher token and update the state object for the current session to reference
                                    const tokenLogin = await import('../TokenLogin')
                                    tokenLogin.default(token, makeRequest, () => navigate('/'), user)
                                }else{
                                    !state.valid ? dispatch({type: "alert"}) : alert("Login attempt failed, please make sure your information is correct!")
                                }
                                    
                            }
        
                            checkInfo()
                    }}>
                        <div className="input-group mb-4">
                            {/*form floating reference the placeholder text getting out of the way of the input when the input box is clicked*/}
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
        
                                        //this flag is to prevent the input from immediately being invalid when you load the page
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
        
                    <a className="mb-4 password-reset"onClick={() => {
                        
                        //turns on/off the password reset box
                        dispatch({
                            type: "reset_password",
                            payload: ""
                        })
                    }}>Forgot password?</a>
                    <p>Not a member? <a href="/register">Register</a></p>
                    
                    {/* 
                    <FaceScanner 
                        state={state} 
                        dispatch={dispatch}
                        navigate={navigate} 
                        user={user}
                    />
                    */}
        
                    {/*
                    A separate box for sending password reset request to email, this box can be turned on and off 
                    based on the state variable which is handled by a close button and the link to the password reset.
                    */}
                    <ResetPassword
                        dispatch={dispatch} 
                        reset_password={state.reset_password}/>
                </div>
            }
        </>
    )
}

export default Login