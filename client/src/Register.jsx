import { useReducer } from "react"
import { useNavigate } from "react-router-dom"
import { useUserInfo } from "./UserProvider"

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

    const handleInput = (e) => {
        dispatch({
            type: e.target.id,
            payload: e.target.value
        })
    }

    const user = useUserInfo()

    const navigate = useNavigate()

    return(
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
                                                const module = await import('./useDB')
                                                const makeRequest = module.makeRequest

                                                const check = await makeRequest({ 
                                                    email: state.email
                                                }, '/checkemployee', null)

                                                if (check){
                                                    
                                                    const token = await makeRequest(state, '/registeremployee', null)

                                                    sessionStorage.setItem('token', token.token)

                                                    const token_decoded = await makeRequest(null, '/userinfo', token)

                                                    user.setUserInfo({
                                                        employee_number: token_decoded[0].employee_number,
                                                        first_name: token_decoded[0].first_name,
                                                        last_name: token_decoded[0].last_name,
                                                        email: token_decoded[0].email,
                                                        password: token_decoded[0].password,
                                                        hourly_wage: token_decoded[0].hourly_wage,
                                                        picture: token_decoded[0].picture
                                                    })

                                                    navigate('/')
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

                                        <img src="https://www.championproducts.com/info/wp-content/uploads/We-Provide-Best-Quality-Products.jpg"
                                        className="img-fluid" alt="Sample image" />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register