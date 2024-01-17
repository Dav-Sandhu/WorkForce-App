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
        <section className="vh-100" style={{backgroundColor: '#9de2ff'}}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-md-9 col-lg-7 col-xl-5">
                        <div className="card" style={{borderRadius: '15px'}}>
                            <div className="card-body p-4">
                                <div className="d-flex text-black">
                                    <div className="flex-shrink-0">
                                        <img src={picture}
                                        alt="" //{user.userInfo.first_name.slice(0,1) + ' ' + user.userInfo.last_name.slice(0,1)} 
                                        className="img-fluid"
                                        style={{width: '180px', borderRadius: '10px'}} />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h5 className="mb-1">{name}</h5>
                                        <p className="mb-2 pb-1" style={{color: '#2b2a2a'}}>{email}</p>
                                        <div className="d-flex justify-content-start rounded-3 p-2 mb-2"
                                        style={{backgroundColor: '#efefef'}}>
                                            <div>
                                                <p className="small text-muted mb-1">Hourly Wage</p>
                                                <p className="mb-0">{wage}</p>
                                            </div>
                                            <div className="px-3">
                                                <p className="small text-muted mb-1">Employee Number</p>
                                                <p className="mb-0">{employee_number}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex pt-1">
                                            <button 
                                                type="button" 
                                                className="btn btn-primary flex-grow-1"
                                                onClick={() => {navigate('/tasks')}}>
                                                    Tasks
                                            </button>
                                        </div>
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