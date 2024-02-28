import "./Jobs.scss"

import { useEffect, useState, lazy } from "react"
import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider" 

//lazy loads the components so that they are only shown when needed
const UserButton = lazy(() => import('../UserButton/UserButton'))
const Customers = lazy(() => import('./Customers'))
const Spinner = lazy(() => import('../Spinner'))

//lists the available jobs to do for the user to select
const Jobs = () => {

    const navigate = useNavigate()
    const user = useUserInfo()

    const [loading, setLoading] = useState(true)
    const [jobs, setJobs] = useState([])
    const [showJobs, setShowJobs] = useState(true)
    const [selectedJob, setSelectedJob] = useState("")

    //adds the spinner while the content is loading
    const loaded = (list) => {
        setLoading(false)
        setJobs(list)
    } 

    useEffect(() => {

        //loads all the jobs
        const request = async () => {
            const token = sessionStorage.getItem('token')

            if (token !== null) {
                const module = await import('../useDB')
                const makeRequest = module.makeRequest

                const output = await makeRequest(null, '/getinternalprocesses', token, "get")
                output.status === 1 ? loaded(output.output) : navigate('/')
            }else{navigate('/login')}
        }

        request()
    }, [])

    return(
        <>
            {loading ? <Spinner /> :
            <>
                <div className="jobs-page">
                    <UserButton /> <br />
                    <div className="jobs-title">
                        <h1 className='fw-bold fs-25 mb-4 text-center text-dark title'>
                            {
                                showJobs ?
                                "What job are you working on?" : 
                                "What customer are you doing the job for?"
                            }
                        </h1>
                        {
                            jobs.length === 0 ? <h5 className="text-center text-muted">There are no jobs available right now...</h5> : ""
                        }
                    </div>

                    <div className="jobs">
                        {   !showJobs ? 
                            <Customers  selectedJob={selectedJob} /> :
                            jobs.map(job => {
                                return(
                                    <button 
                                        className="btn btn-lg job-button mb-3" 
                                        key={job.process_type} 
                                        onClick={() => {
                                            setSelectedJob(job.process_type)
                                            setShowJobs(false)
                                        }}
                                    >
                                        {job.process_type}
                                    </button>
                                )
                            })
                        }
                    </div> 
                </div>
            </>
            }
        </>
    )
}

export default Jobs