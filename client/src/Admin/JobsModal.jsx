import './JobsModal.scss'

import { useState, useEffect } from 'react'

const JobsModal = ({ employee_number, setShowJobs }) => {

    const [jobs, setJobs] = useState([])
    const [assigned, setAssigned] = useState([])
    const [select, setSelect] = useState("")
    const [updated, setUpdated] = useState(false)

    //gets a list of all available jobs and the jobs that are already assigned to the employee
    const getJobs = async () => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const token = sessionStorage.getItem('token')

        const previouslyAssignedJobs = await makeRequest({ employee_number }, '/getjobs', token)
        const output = await makeRequest(null, '/getinternalprocesses', token)

        setAssigned(previouslyAssignedJobs.output)
        setJobs(output.output)
        output.output.length > 0 ? setSelect(output.output[0].process_type) : ""
    }

    //adds the selected job to the employee's assigned jobs
    const assignJob = async () => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const output = await makeRequest({ employee_number, process_type: select }, '/assignjob', null)

        if (output.status === -1){
            import('../Alert').then(async module => {
                await module.customAlert("Failed to Assign Job!", output.error, "error")
            })
        }else{

            await makeRequest({employee_number}, '/deletejobrequest', null)

            import('../Alert').then(async module => {
                await module.customAlert("Success!", "Job was successfully assigned to employee.", "success")
            })
        }

        setUpdated(prev => !prev) //to update the screen with the added assigned job
    }

    useEffect(() => {
        getJobs()
    }, [updated])

    return(
        <div className="jobs-modal">
            <div className='top-section'>
                <u><h3>Assigned Jobs</h3></u>
                <button type="button" class="btn-close" aria-label="Close" onClick={() => setShowJobs(false)}></button>
            </div>
            {
                assigned.length === 0 ? <p>No jobs assigned...</p> : 
                assigned.map(j => { return <p key={j.process_type}>{j.process_type}</p> })
            }
            <h4>Select a job to assign</h4>
            <select 
                value={select}
                onChange={(e) => setSelect(e.target.value)}
            >
                { jobs.map(j => { return <option key={j.process_type} value={j.process_type}>{j.process_type}</option> }) }
            </select>
            <button type="button" className="btn btn-success" onClick={assignJob}>Assign</button>
        </div>
    )
}

export default JobsModal