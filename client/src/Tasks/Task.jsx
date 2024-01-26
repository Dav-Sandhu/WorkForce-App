import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../UserProvider'
import './Task.scss'
import UserButton from '../UserButton/UserButton'

const Task = () => {

    const navigate = useNavigate()
    const user = useUserInfo()

    const takeABreak = async (type) => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        await makeRequest(
            {
                employee_number: user.userInfo.employee_number,
                break_type: type
            },
            '/startbreak',
            null
        )

        navigate('/working')
    }

    return(
        <div className="tasks-page">
            <UserButton /> <br />
            <h1 className='tasks-title fw-bold fs-25 mb-4 text-center text-dark title'>What do you want to do?</h1> <br />
            
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
                    onClick={() => {
                        takeABreak('break')
                    }}
                    >
                        Take a Break
                </button>

                <button
                    type='button'
                    className='btn btn-lg btn-danger'
                    onClick={() => {
                        takeABreak('lunch')
                    }}
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

                            await makeRequest({ employee_number: user.userInfo.employee_number }, '/clockout', null)
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