import "./Home.scss"

import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider"

import Clock, { convertToTime } from "../Clock"

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

    return(
        <section className="vh-100" style={{backgroundColor: '#eee'}}>
            {clock_in !== null && clock_out === null ? <Clock /> : ""}
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-12 col-xl-4">
                        <div className="card" style={{borderRadius: '15px'}}>
                            <div className="card-body text-center">
                                <div className="mt-3 mb-4">
                                    <img 
                                        src={picture} 
                                        className="rounded-circle img-fluid profile-picture" 
                                        style={{width: '100px'}}
                                        onClick={() => {
                                            // change profile picture
                                            const fileInput = document.createElement('input')
                                            fileInput.type = 'file'
                                            fileInput.accept = 'image/*'
                                            fileInput.onchange = (e) => {
                                                const file = e.target.files[0]
                                                console.log('Uploaded image:', file)
                                                
                                                if (file.size <= 1 * 1024 * 1024) { // Check if file size is less than or equal to 1 MB
                                                    console.log("Successfull upload")
                                                } else {
                                                    alert("Image cannot be larger than 1 MB")
                                                }
                                            }

                                            fileInput.click()
                                        }} 
                                    />
                                </div>
                                <h4 className="mb-2">{name}</h4>
                                <p className="text-muted mb-4">{email}</p>
                                {clock_out === null ? <button 
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
                                </button> : "You Are Done For The Day!"}
                                <div className="d-flex justify-content-between text-center mt-5 mb-2">
                                    <div>
                                        <p className="mb-2 mr-3 h5 text-nowrap ">{employee_number}</p>
                                        <p className="text-muted mb-0">Employee Number</p>
                                    </div>
                                    <div>
                                        <p className="mb-2 mr-3 h5 text-nowrap ">{clock_in === null ? <Clock /> : clock_out === null ? convertToTime(clock_in) : convertToTime(clock_out)}</p>
                                        <p className="text-muted mb-0">{clock_in === null ? "Current Time" : clock_out === null ? "Clocked In" : "Clocked Out"}</p>
                                    </div>
                                    <div className="px-3">
                                        <p className="mb-2 mr-3 h5 text-nowrap ">{wage}</p>
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