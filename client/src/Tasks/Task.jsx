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
            sessionStorage.getItem('token'),
            'post'
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
                    onClick={() => navigate('/working')}
                >
                    Work
                </button>
            </div>
        </div>
    )
}

export default Task