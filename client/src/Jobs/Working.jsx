import "./Working.scss"

import { useEffect, useState, lazy } from "react"
import { useUserInfo } from "../UserProvider"

const UserButton = lazy(() => import('../UserButton/UserButton'))
const Spinner = lazy(() => import('../Spinner'))

//showcases what the user is currently working on and allows the user to finish the job or remove said jobs/breaks
const Working = () => {

    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState([])

    const user = useUserInfo()
    const employee_number = user.userInfo.employee_number

    const token = sessionStorage.getItem('token')

    //gets all the tasks/breaks that the user is currently working on
    const getTasks = async () => {
        const module = await import("../useDB")
        const makeRequest = module.makeRequest

        const processes = await makeRequest(null, '/getunfinishedprocesses', token, "get")
        const breaks = await makeRequest(null, '/getbreaks', token, "get")
        
        const output = [...processes.output, ...breaks.output]
        output.sort((a, b) => new Date(a.start) - new Date(b.start))
        
        setLoading(false)
        setTasks(output)
    }

    //finishes the selected task/break
    const finishTask = async (task) => {
        const module = await import("../useDB")
        const makeRequest = module.makeRequest

        const output = !task.break_type ? await makeRequest({
            process_type: task.process_type, 
            business_name: task.business_name,
            contact_email: task.contact_email,
            start: task.start
        }, '/finishjob', token, "post") : 
        await makeRequest({
            start: task.start 
        }, '/endbreak', token, "post")

        //alerts the user if something went wrong with the requests
        output.status === 1 ? getTasks() : 
        import('../Alert').then(async module => {
            await module.customAlert("Something Went Wrong!", "Please try again later.", "error")
        })
    }

    //removes the selected task/break
    const removeTask = async (task) => {   
        const module = await import("../useDB")
        const makeRequest = module.makeRequest

        const output = !task.break_type ? await makeRequest({
            process_type: task.process_type, 
            business_name: task.business_name,
            contact_email: task.contact_email,
            start: task.start
        }, '/deletejob', token, "post") : await makeRequest({
            break_type: task.break_type,
            start: task.start 
        }, '/deletebreak', token, "post")

        output.status === 1 ? getTasks() :
        import('../Alert').then(async module => {
            await module.customAlert("Something Went Wrong!", "Please try again later.", "error")
        })
    }

    useEffect(() => {
        getTasks()
    }, [])

    return (
        <>
            { loading ? <Spinner /> : 
                <>
                    {/*User button allows the user to go back to the home page*/}
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
            }
        </>
    )
}

export default Working