import { useReducer, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider"

import reducer from './RegisterReducer'

const Register = () => {

    const [state, dispatch] = useReducer(reducer, {
        employee_number: "",
        first_name: "",
        password: "",
        repeat_password: "",
        last_name: "",
        email: "",
        hourly_wage: 0.0,
        picture: ""
    })

    const [loading, setLoading] = useState(false)

    const handleInput = (e) => {
        dispatch({
            type: e.target.id,
            payload: e.target.value
        })
    }

    const user = useUserInfo()
    const navigate = useNavigate()

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

    return(
        <>
            {loading ?                 
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                :
                <section className="vh-100" style={{backgroundColor: '#eee'}}>
                    <div className="container h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-lg-12 col-xl-11">
                                <div className="card text-black" style={{borderRadius: '25px'}}>
                                    <div className="card-body p-md-5">
                                        <div className="row justify-content-center">
                                            <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                                                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                                                <form className="mx-1 mx-md-4" onSubmit={(e) => {
                                                    e.preventDefault()

                                                    const checkEmployee = async () => {
                                                        const module = await import('../useDB')
                                                        const makeRequest = module.makeRequest

                                                        const check = await makeRequest({ 
                                                            email: state.email
                                                        }, '/checkemployee', null)

                                                        if (check.status === 1 && check.found){
                                                            const res = await makeRequest(state, '/registeremployee', null)

                                                            if (res.status === 1){
                                                                const token = res.token

                                                                sessionStorage.setItem('token', token)

                                                                const tokenLogin = await import('../TokenLogin')
                                                                tokenLogin.default(token, makeRequest, () => navigate('/'), user)
                                                            }else{
                                                                alert("Failed to register employee")
                                                            }
                                                        }else{
                                                            alert("Email already registered!")
                                                        }
                                                    }

                                                    if (state.password === state.repeat_password && state.password.length > 0){
                                                        checkEmployee()
                                                    }
                                                }}>

                                                    <div className="d-flex flex-row align-items-center mb-4">
                                                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                        <div className="form-outline flex-fill mb-0">
                                                            <input 
                                                                type="text" 
                                                                id="first_name" 
                                                                className="form-control"
                                                                value={state.first_name}
                                                                onChange={handleInput} />
                                                            <label className="form-label" htmlFor="first_name">First Name</label>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex flex-row align-items-center mb-4">
                                                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                        <div className="form-outline flex-fill mb-0">
                                                            <input 
                                                                type="text" 
                                                                id="last_name" 
                                                                className="form-control"
                                                                value={state.last_name}
                                                                onChange={handleInput} />
                                                            <label className="form-label" htmlFor="last_name">Last Name</label>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex flex-row align-items-center mb-4">
                                                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                        <div className="form-outline flex-fill mb-0">
                                                            <input 
                                                                type="email" 
                                                                id="email" 
                                                                className="form-control"
                                                                value={state.email}
                                                                onChange={handleInput} />
                                                            <label className="form-label" htmlFor="email">Your Email</label>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex flex-row align-items-center mb-4">
                                                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                        <div className="form-outline flex-fill mb-0">
                                                            <input 
                                                                type="password" 
                                                                id="password" 
                                                                className="form-control"
                                                                value={state.password}
                                                                onChange={handleInput} />
                                                            <label className="form-label" htmlFor="password">Password</label>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex flex-row align-items-center mb-4">
                                                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                                        <div className="form-outline flex-fill mb-0">
                                                            <input 
                                                                type="password" 
                                                                id="repeat_password" 
                                                                className="form-control"
                                                                value={state.repeat_password}
                                                                onChange={handleInput} />
                                                            <label className="form-label" htmlFor="repeat_password">Repeat your password</label>
                                                        </div>
                                                    </div>

                                                    <div className="form-check d-flex justify-content-center mb-5">
                                                        <input className="form-check-input me-2" type="checkbox" value="" id="terms" />
                                                        <label className="form-check-label" htmlFor="terms">
                                                        I agree all statements in <a href="#!">Terms of service</a>
                                                        </label>
                                                    </div>

                                                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                        <input type="submit" className="btn btn-primary btn-lg" value="Register" />
                                                    </div>

                                                </form>

                                            </div>
                                            <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                                <img src="/register image.jpg" className="img-fluid" alt="Sample image" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </>
    )
}

export default Register