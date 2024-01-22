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
    const clock_in = user.userInfo.clock_in
    const clock_out = user.userInfo.clock_out

    function convertToTime(dateString) {
        const date = new Date(dateString)
        let hours = date.getUTCHours()
        const minutes = date.getUTCMinutes().toString().padStart(2, '0')
        const ampm = hours >= 12 ? 'PM' : 'AM'
    
        hours = hours % 12
        hours = hours ? hours : 12
        hours = hours.toString().padStart(2, '0')
    
        return `${hours}:${minutes} ${ampm}`
    }

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
                                    onClick={() => {
                                        
                                        if (clock_in === null){
                                            const request = async () => {

                                                const module = await import('../useDB')
                                                const makeRequest = module.makeRequest
    
                                                const res = await makeRequest({ employee_number: employee_number }, '/clockin', null)

                                                const updatedUserValues = { ...user.userInfo, clock_in: res.output[0].clock_in }

                                                user.setUserInfo(updatedUserValues)

                                                const updatedToken = await makeRequest(updatedUserValues, '/updateToken', null)

                                                sessionStorage.removeItem('token')
                                                sessionStorage.setItem('token', updatedToken.token)
                                            }
    
                                            request()
                                        }else{
                                            navigate('/tasks')
                                        }
                                    }}> 
                                    {clock_in !== null ? "Tasks" : "Clock In"}
                                </button>
                                <div className="d-flex justify-content-between text-center mt-5 mb-2">
                                    <div>
                                        <p className="mb-2 h5">{employee_number}</p>
                                        <p className="text-muted mb-0">Employee Number</p>
                                    </div>
                                    <div>
                                        <p className="mb-2 h5">{clock_in !== null ? clock_out !== null ? "Clocked Out" : convertToTime(clock_in) : "-"}</p>
                                        <p className="text-muted mb-0">Clock In</p>
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