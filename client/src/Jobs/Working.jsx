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

        const processes = await makeRequest({ employee_number }, '/getunfinishedprocesses', sessionStorage.getItem('token'))
        const breaks = await makeRequest({ employee_number }, '/getbreaks', sessionStorage.getItem('token'))
        
        const output = [...processes.output, ...breaks.output]
        output.sort((a, b) => new Date(a.start) - new Date(b.start))
        
        setTasks(output)
    }

    const finishTask = async (task) => {
        const module = await import("../useDB")
        const makeRequest = module.makeRequest

        const output = !task.break_type ? await makeRequest({
            employee_number, 
            process_type: task.process_type, 
            business_name: task.business_name,
            contact_email: task.contact_email,
            start: task.start
        }, '/finishjob', null) : 
        await makeRequest({
            employee_number,
            start: task.start 
        }, '/endbreak', null)

        output.status === 1 ? getTasks() : alert("Something went wrong: please try again later")
    }

    const removeTask = async (task) => {   
        const module = await import("../useDB")
        const makeRequest = module.makeRequest

        const output = !task.break_type ? await makeRequest({
            employee_number, 
            process_type: task.process_type, 
            business_name: task.business_name,
            contact_email: task.contact_email,
            start: task.start
        }, '/deletejob', null) : await makeRequest({
            employee_number,
            break_type: task.break_type,
            start: task.start 
        }, '/deletebreak', null)

        output.status === 1 ? getTasks() : alert("Something went wrong: please try again later")
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
                        const content = !task.break_type ? task.business_name + ": " + task.process_type : task.break_type

                        return (
                            <div className="ongoing-task mb-4" key={task.start}>
                                <div className="work-information">
                                    <button 
                                        type="button" 
                                        className="close-button-left btn-close" 
                                        onClick={() => { removeTask(task) }}></button>

                                    <div className="work-description">
                                        <h3>{content}</h3>
                                        <p>{date.toLocaleString()}</p>
                                    </div>

                                    <button 
                                        type="button" 
                                        className="close-button-right btn btn-light" 
                                        onClick={() => { removeTask(task) }}>Remove</button>
                                </div>
                                <button 
                                    className="finish-button btn btn-danger"
                                    onClick={() => { finishTask(task) }}>Finished</button>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Working