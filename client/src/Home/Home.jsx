import "./Home.scss"

import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider"

const Home = () => {

    const user = useUserInfo()
    const navigate = useNavigate()

    const picture = user.userInfo.picture.length > 0 ? user.userInfo.picture : "/default profile picture.jpg" 
    const name = user.userInfo.first_name + ' ' + user.userInfo.last_name
    const email = user.userInfo.email
    const wage = '$' + user.userInfo.hourly_wage + '/hour'
    const employee_number = user.userInfo.employee_number

    return(
        <section className="vh-100" style={{backgroundColor: '#eee'}}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-12 col-xl-4">
                        <div className="card" style={{borderRadius: '15px'}}>
                            <div className="card-body text-center">
                                <div className="mt-3 mb-4">
                                    <img src={picture} className="rounded-circle img-fluid" style={{width: '100px'}} />
                                </div>
                                <h4 className="mb-2">{name}</h4>
                                <p className="text-muted mb-4">{email}</p>
                                <button 
                                    type="button" 
                                    className="btn btn-primary btn-rounded btn-lg"
                                    onClick={() => {navigate('/tasks')}}> Tasks
                                </button>
                                <div className="d-flex justify-content-between text-center mt-5 mb-2">
                                    <div>
                                        <p className="mb-2 h5">{employee_number}</p>
                                        <p className="text-muted mb-0">Employee Number</p>
                                    </div>
                                    <div className="px-3">
                                        <p className="mb-2 h5">{wage}</p>
                                        <p className="text-muted mb-0">Hourly Wage</p>
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
export default Home