import './Assign.scss'

import Navbar from "./Navbar"

import { useEffect, useState, lazy } from "react"

const JobsModal = lazy(() => import('./JobsModal'))

const Assign = () => {

    const [employees, setEmployees] = useState([])  
    const [requests, setRequests] = useState([])
    const [showJobs, setShowJobs] = useState(false)
    const [currentEmployee, setCurrentEmployee] = useState('')

    const getEmployees = async () => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const output = await makeRequest(null, '/getemployees', sessionStorage.getItem('token'))
        const requestsOutput = await makeRequest(null, '/getrequests', sessionStorage.getItem('token')) //gets a list of users who have requested a job

        setEmployees(output.output)
        setRequests(requestsOutput.output)
    }

    useEffect(() => {
        getEmployees()
    }, [])

    return(
    <>
        <Navbar />
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