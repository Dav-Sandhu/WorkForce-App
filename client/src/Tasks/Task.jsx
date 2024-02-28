import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../UserProvider'
import { useRef, useState, lazy } from 'react' 
import './Task.scss'

const WebCamModal = lazy(() => import("./WebCamModal"))
import Clock from "../Clock"

const Task = () => {

    const navigate = useNavigate()
    const user = useUserInfo()

    //for managing the webcam modal element for when a user wants to change their profile picture
    const [webcamActive, setWebcamActive] = useState(false)
    //reference for the webcam modal to take the screenshot
    const ref = useRef(null)

    //user's profile information
    const picture = user.userInfo.picture
    const name = user.userInfo.first_name + ' ' + user.userInfo.last_name
    const email = user.userInfo.email
    const clock_in = user.userInfo.clock_in
    const clock_out = user.userInfo.clock_out
    const is_supervisor = user.userInfo.is_supervisor

    const takeABreak = async (type) => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        await makeRequest(
            {
                employee_number: user.userInfo.employee_number,
                break_type: type
            },
            '/startbreak',
            sessionStorage.getItem('token'),
            'post'
        )

        navigate('/working')
    }

    return(
        <div className="tasks-page">

            {/*if the user is clocked in it will show how long the user has been clocked in*/}
            {
                clock_in !== null && clock_out === null ? 
                <div className="top-section">
                    <Clock />
                    {
                        is_supervisor ? 
                            <button 
                                type="button" 
                                style={{
                                    backgroundColor: "#343a40",
                                    color: "#FFFFFF"
                                }}
                                onClick={() => navigate('/admin')}
                            >Admin</button>: ""
                    }
                </div> 
                :  
                ""
            }

            {/*webcam modal which is only enabled when the profile picture is clicked*/}
            {webcamActive ? <WebCamModal ref={ref} setWebcamActive={setWebcamActive} /> : ""}

            {
                clock_in === null ?
                <>
                    <button 
                        type="button" 
                        style={{ backgroundColor: "#3f47cc", color: "#FFFFFF" }}
                        onClick={() => {
                            setWebcamActive(true)
                        }} 
                    >
                        Update Profile Picture
                    </button>
                    <div className="not_clocked_in">
                    <div className="mt-3 mb-4">
                        <img 
                            src={ picture } 
                            className="img-fluid profile-picture" 
                            loading="lazy"
                            style={{width: '100px'}}
                            onError={(e) => {e.target.onerror = null; e.target.src="/default profile picture.jpg"}}
                        />
                    </div>
                    <div>
                        <h4 className="mb-2">{name}</h4>
                        <p className="text-muted mb-4">{email}</p>
                    </div>
                    <button 
                        type="button" 
                        className="btn btn-primary btn-rounded btn-lg m-2"
                        onClick={() => {
                            
                            const request = async () => {

                                //for importing the method by which the frontend interacts with the server/database
                                const module = await import('../useDB')
                                const makeRequest = module.makeRequest
                                
                                //clocks the user in
                                const res = await makeRequest(null, '/clockin', sessionStorage.getItem('token'), 'post')

                                //removes the old token and adds the new one to session storage
                                sessionStorage.removeItem('token')
                                sessionStorage.setItem('token', res.token)

                                //updates state with the new token
                                const tokenLogin = await import('../TokenLogin')
                                await tokenLogin.default(res.token, makeRequest, () => {}, user)
                            }

                            request()
                            
                        }}> 
                        Clock In
                    </button> 
                </div>
                </>
                : 
                <>
                    <h1 className='tasks-title fw-bold fs-25 mb-4 text-center text-dark title'>What do you want to do?</h1> <br />
                
                    <div className='tasks'>

                        <button
                            type="button"
                            className='btn btn-lg btn-primary'
                            onClick={() => navigate('/jobs')}>
                                Start a Task
                        </button>

                        <button
                            type='button'
                            className='btn btn-lg btn-info'
                            onClick={() => navigate('/working')}
                        >
                            Current Task
                        </button>

                        {/* <button
                            type='button'
                            className='btn btn-lg btn-warning'
                            onClick={() => {
                                const request = async () => {

                                    const employee_number = user.userInfo.employee_number

                                    const module = await import('../useDB')
                                    const makeRequest = module.makeRequest

                                    const output = await makeRequest({ employee_number }, '/requestjob', sessionStorage.getItem('token'), 'post')

                                    if (output.status === 1){
                                        import('../Alert').then(async module => {
                                            await module.customAlert("Success!", "You have requested a job.", "success")
                                        })
                                    }else{
                                        import('../Alert').then(async module => {
                                            await module.customAlert("Failed to Request Job!", "You have already requested a job.", "error")
                                        })
                                    }
                                }

                                request()
                            }}
                            >
                                Ask for a Job
                        </button> */}

                        <button
                            type='button'
                            className='btn btn-lg btn-success'
                            onClick={() => {
                                takeABreak('break')
                            }}
                            >
                                Take a Break
                        </button>

                        <button
                            type='button'
                            className='btn btn-lg btn-warning'
                            onClick={() => {
                                takeABreak('lunch')
                            }}
                            >
                                Go To Lunch
                        </button>

                        <button
                            className="btn btn-danger btn-lg"
                            onClick={() => {
                                const request = async () => {

                                    const module = await import('../useDB')
                                    const makeRequest = module.makeRequest

                                    await makeRequest(null, '/clockout', sessionStorage.getItem('token'), 'post')

                                    sessionStorage.removeItem('token')
                                    window.location.reload()
                                }

                                request()
                            }}
                        >
                            Clock Out
                        </button>
                    </div>
                </>
            }
        </div>
    )
}

export default Task