import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../UserProvider'
import './Task.scss'
import UserButton from '../UserButton/UserButton'

const Task = () => {

    const navigate = useNavigate()
    const user = useUserInfo()

    return(
        <div className="tasks-page">
            <UserButton /> <br />
            <h1 className='tasks-title fw-bold fs-25 mb-1 text-center text-dark title'>What do you want to do?</h1> <br />
            
            <div className='tasks'>

                <button
                    type="button"
                    className='btn btn-lg btn-primary'
                    onClick={() => navigate('/jobs')}>
                            Join a Job
                </button>

                <button
                    type='button'
                    className='btn btn-lg btn-warning'
                    >
                        Ask for a Job
                </button>

                <button
                    type='button'
                    className='btn btn-lg btn-success'
                    >
                        Take a Break
                </button>

                <button
                    type='button'
                    className='btn btn-lg btn-danger'
                    >
                        Go To Lunch
                </button>

                <button
                    type='button'
                    className='btn btn-lg btn-info'
                    onClick={() => {

                        const request = async () => {

                            const module = await import('../useDB')
                            const makeRequest = module.makeRequest

                            const res = await makeRequest({ employee_number: user.userInfo.employee_number }, '/clockout', null)

                            console.log(res)
                        }

                        request()

                        sessionStorage.removeItem('token')
                        window.location.reload()
                    }}
                    >
                        Finish Shift
                </button>
            </div>
        </div>
    )
}

export default Task