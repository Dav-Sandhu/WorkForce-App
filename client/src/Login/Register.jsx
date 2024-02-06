import { useReducer, useEffect, useState, lazy } from "react"
import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider"

import reducer from './RegisterReducer'

const Spinner = lazy(() => import('../Spinner'))

//for registering a new employee
const Register = () => {

    //holds the given information about the registering user
    const [state, dispatch] = useReducer(reducer, {
        employee_number: "",
        first_name: "",
        password: "",
        repeat_password: "",
        last_name: "",
        email: "",
        hourly_wage: 0.0,
        picture: "",
        is_admin: 0
    })

    //shows a spinner while the page is loading
    const [loading, setLoading] = useState(false)

    //for interacting with the reducer and updating the state
    const handleInput = (e) => {
        dispatch({
            type: e.target.id,
            payload: e.target.value
        })
    }

    //user context
    const user = useUserInfo()
    
    //for navigating to different pages
    const navigate = useNavigate()

    useEffect(() => {

        //checks if the user is logged in
        const token = sessionStorage.getItem('token')

        if (token !== null){

            //if the token is not empty it will attempt to log the user in
            const request = async () => {
                const module = await import('../useDB')
                const tokenLogin = await import('../TokenLogin')

                const res = await tokenLogin.default(token, module.makeRequest, () => navigate('/'), user)

                //if the token failed to log the user in it will remove the token to ensure the page doesn't keep reloading
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
                <Spinner />
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

                                                    //checks if the user is already registered before proceeding
                                                    const checkEmployee = async () => {
                                                        const module = await import('../useDB')
                                                        const makeRequest = module.makeRequest

                                                        //checks if the email is already registered
                                                        const check = await makeRequest({ 
                                                            email: state.email
                                                        }, '/checkemployee', null, "")

                                                        //if the email is not registered it will proceed to register the user
                                                        if (check.status === 1 && check.found){
                                                            const res = await makeRequest(state, '/registeremployee', null, "")

                                                            if (res.status === 1){
                                                                const token = res.token

                                                                sessionStorage.setItem('token', token)

                                                                const tokenLogin = await import('../TokenLogin')
                                                                tokenLogin.default(token, makeRequest, () => navigate('/'), user)
                                                            }else{
                                                                import('../Alert').then(async module => {
                                                                    await module.customAlert("There Was A Problem!", "Failed to register employee.", "error")
                                                                })
                                                            }
                                                        }else{

                                                            //if the email is already registered it will alert the user
                                                            import('../Alert').then(async module => {
                                                                await module.customAlert("Could Not Proceed!", "Email already registered.", "error")
                                                            })
                                                        }
                                                    }

                                                    //checks if all the fields are filled out before proceeding
                                                    if (
                                                        state.first_name.length > 0 && state.last_name.length > 0 &&
                                                        state.email.length > 0 && state.password.length > 0 &&
                                                        state.password === state.repeat_password
                                                        ){
                                                        checkEmployee()
                                                    }else{

                                                        //if the fields are not filled out it will alert the user
                                                        import('../Alert').then(async module => {
                                                            await module.customAlert("Could Not Proceed!", "Please fill out all fields.", "error")
                                                        })
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