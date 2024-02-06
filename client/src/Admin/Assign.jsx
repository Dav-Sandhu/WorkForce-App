import './Assign.scss'

import Navbar from "./Navbar"

import { useEffect, useState, lazy } from "react"

const JobsModal = lazy(() => import('./JobsModal'))

const Assign = () => {

    //for keeping track of the employees
    const [employees, setEmployees] = useState([])  

    //for keeping track of the employees who have requested a job
    const [requests, setRequests] = useState([])

    //for showing the modal for assigning jobs to employees
    const [showJobs, setShowJobs] = useState(false)

    //for keeping track of the employee number of the employee whose jobs are being assigned
    const [currentEmployee, setCurrentEmployee] = useState('') 

    const getEmployees = async () => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const output = await makeRequest(null, '/getemployees', sessionStorage.getItem('token'), 'get')
        
        //gets a list of users who have requested a job
        const requestsOutput = await makeRequest(null, '/getrequests', sessionStorage.getItem('token'), 'get') 

        setEmployees(output.output)
        setRequests(requestsOutput.output)
    }

    useEffect(() => {
        getEmployees()
    }, [])

    return(
    <>
        <Navbar />
        {/*modal for assigning jobs to employees*/}
        { showJobs ? <JobsModal employee_number={currentEmployee} setShowJobs={setShowJobs} /> : "" }
        <div className="employees_list">
            <h1>Assign Jobs</h1>
            {
                employees.map(e => {
                    return(
                        <div key={e.employee_number} className='employee'>
                            <div className="left-section">
                                <img
                                    className="profile-picture"
                                    loading="lazy"
                                    onError={(e) => {e.target.onerror = null; e.target.src="/default profile picture.jpg"}} 
                                    src={e.picture} 
                                />
                                <h3>{e.first_name + ' ' + e.last_name}</h3>
                                <p>{'#' + e.employee_number}</p>
                                {   
                                    //checks if the employee has requested a job
                                    requests.some(req => req.employee_number === e.employee_number) ? 
                                    <p className="request">Job Requested</p> : 
                                    ""
                                }
                            </div>
                            
                            <div className='right-section'>
                                <button
                                    type="button"
                                    className="btn btn-dark" 
                                    onClick={() => {
                                    setCurrentEmployee(e.employee_number)
                                    setShowJobs(prev => !prev)
                                }}>Assign</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </>
    )
}

export default Assign