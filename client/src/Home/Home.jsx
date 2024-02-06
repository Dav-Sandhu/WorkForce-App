import "./Home.scss"

import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider"

import Clock, { convertToTime } from "../Clock"
import { lazy, useRef, useState } from "react"

const WebCamModal = lazy(() => import("../Home/WebCamModal"))

//the main hub for the user, where they can clock in, view their tasks, and view their profile
const Home = () => {

    //for managing the webcam modal element for when a user wants to change their profile picture
    const [webcamActive, setWebcamActive] = useState(false)
    //reference for the webcam modal to take the screenshot
    const ref = useRef(null)

    const user = useUserInfo()
    const navigate = useNavigate()

    //user's profile information
    const picture = user.userInfo.picture
    const name = user.userInfo.first_name + ' ' + user.userInfo.last_name
    const email = user.userInfo.email
    const wage = '$' + user.userInfo.hourly_wage + '/hour'
    const employee_number = user.userInfo.employee_number
    const clock_in = user.userInfo.clock_in
    const clock_out = user.userInfo.clock_out

    return(
        <section className="vh-100" style={{backgroundColor: '#eee'}}>
            
            {/*if the user is clocked in it will show how long the user has been clocked in*/}
            {clock_in !== null && clock_out === null ? <Clock /> : ""}

            {/*webcam modal which is only enabled when the profile picture is clicked*/}
            {webcamActive ? <WebCamModal ref={ref} setWebcamActive={setWebcamActive} /> : ""}

            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-12 col-xl-4">
                        {/*profile card which showcases the user's information*/}
                        <div className="card" style={{borderRadius: '15px'}}>
                            <div className="card-body text-center">
                                <div className="mt-3 mb-4">
                                    {/*users profile picture which provides a fallback in case the image link is broken*/}
                                    <img 
                                        src={ picture } 
                                        className="img-fluid profile-picture" 
                                        loading="lazy"
                                        style={{width: '100px'}}
                                        onError={(e) => {e.target.onerror = null; e.target.src="/default profile picture.jpg"}}
                                        onClick={() => {
                                            setWebcamActive(true)
                                        }} 
                                    />
                                </div>
                                <h4 className="mb-2">{name}</h4>
                                <p className="text-muted mb-4">{email}</p>
                                <div className="home-buttons">
                                    {/*
                                        if the user is not clocked in the button will be for clocking in, 
                                        if they are then it will be for navigating to the tasks page
                                    */}
                                    <button 
                                        type="button" 
                                        className="btn btn-primary btn-rounded btn-lg"
                                        onClick={() => {
                                            
                                            if (clock_in === null){
                                                const request = async () => {

                                                    //for importing the method by which the frontend interacts with the server/database
                                                    const module = await import('../useDB')
                                                    const makeRequest = module.makeRequest
                                                    
                                                    //clocks the user in
                                                    const res = await makeRequest({ employee_number: employee_number }, '/clockin', sessionStorage.getItem('token'), 'post')

                                                    //updates the current state of the logged in user
                                                    const updatedUserValues = { ...user.userInfo, clock_in: res.output[0].clock_in }
                                                    user.setUserInfo(updatedUserValues)

                                                    //updates the token in the session storage
                                                    const updatedToken = await makeRequest(updatedUserValues, '/updateToken', null, "")

                                                    //removes the old token and adds the new one to session storage
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
                                    {
                                        /*
                                            if the user is clocked in it will show the agenda button which 
                                            shows what the user is working on
                                        */
                                        clock_in !== null ? 
                                        <button 
                                            className="btn btn-success btn-rounded btn-lg"
                                            onClick={() => {
                                                navigate('/working')
                                            }}
                                        >Work</button> : 
                                        ""
                                    }
                                </div>
                                {/*
                                    shows the user's employee number, the time they clocked in, and their hourly wage
                                */}
                                <div className="d-flex justify-content-between text-center mt-5 mb-2">
                                    <div>
                                        <p className="mb-2 mr-3 h5 text-nowrap ">{'#' + employee_number}</p>
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