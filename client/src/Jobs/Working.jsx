import "./Working.scss"

import { useEffect, useState, lazy } from "react"
import { useUserInfo } from "../UserProvider"

const UserButton = lazy(() => import('../UserButton/UserButton'))

const Working = () => {

    const [tasks, setTasks] = useState([])

    const user = useUserInfo()
    const employee_number = user.userInfo.employee_number

    const getTasks = async () => {
        const module = await import("../useDB")
        const makeRequest = module.makeRequest

        const output = await makeRequest({ employee_number }, '/getunfinishedprocesses', sessionStorage.getItem('token'))
        setTasks(output.output)
    }

    useEffect(() => {
        getTasks()
    }, [])

    return (
        <>
            <UserButton /> <br />
            <div className="working-container">
                <h1 className='jobs-title fw-bold fs-25 mb-4 text-center text-dark title'>Currently Working On</h1>
                {
                    tasks.length === 0 ? <h5 className="text-center text-muted">You are not working on anything...</h5> :
                    tasks.map(task => {

                        const date = new Date(task.start)

                        return (
                            <div className="ongoing-task mb-4" key={task.start}>
                                <div className="work-information">
                                    <h3>{task.business_name + ": " + task.process_type}</h3>
                                    <p>{date.toLocaleString()}</p>
                                </div>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => {
                                        const request = async () => {
                                            const module = await import("../useDB")
                                            const makeRequest = module.makeRequest

                                            const output = await makeRequest({
                                                employee_number, 
                                                process_type: task.process_type, 
                                                business_name: task.business_name,
                                                contact_email: task.contact_email,
                                                start: task.start
                                            }, '/finishjob', null)

                                            output.status === 1 ? getTasks() : alert("Something went wrong: please try again later")
                                    }

                                    request()
                                }}>Finished</button>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Working