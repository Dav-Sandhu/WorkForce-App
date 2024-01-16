import { useReducer } from "react"

const reducer = (state, {type, payload}) => {
    switch(type){
        case "employee_number":
            return {...state, employee_number: payload}
        case "password":
            return {...state, password: payload}
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

                        <form className="mx-1 mx-md-4">

                        <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                            <input type="text" id="first_name" className="form-control" />
                            <label className="form-label" htmlFor="first_name">First Name</label>
                            </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                            <input type="text" id="last_name" className="form-control" />
                            <label className="form-label" htmlFor="last_name">Last Name</label>
                            </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                            <input type="email" id="email" className="form-control" />
                            <label className="form-label" htmlFor="email">Your Email</label>
                            </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                            <input type="password" id="password" className="form-control" />
                            <label className="form-label" htmlFor="password">Password</label>
                            </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                            <input type="password" id="repeat_password" className="form-control" />
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
                            <button type="button" className="btn btn-primary btn-lg">Register</button>
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