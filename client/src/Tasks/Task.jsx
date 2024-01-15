import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../UserProvider'
import { useEffect } from 'react'
import './Task.scss'
import tasks from './Tasks.json'

const Task = () => {

    const navigate = useNavigate()
    const user = useUserInfo()

    useEffect(() => {   
        if(user.userInfo.employee_number.length === 0 || user.userInfo.password.length === 0){
            navigate('/login')
        }
    }, [])

    return(
        <div className="tasks-page">
            <h1 className='tasks-title fw-bold fs-25 mb-1 text-center text-dark title'>What do you want to do?</h1>
            
            <div className='tasks'>

                {tasks.map(t => {
                    return(
                        <Link to={t.route} key={t.name}>
                            <button
                                type="button"  
                                className={"btn btn-lg " + t.color}
                            >
                                {t.name}
                            </button>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default Task