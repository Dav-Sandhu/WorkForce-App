import "./Jobs.scss"

import jobsList from "./Jobs.json"

const Jobs = () => {
    return(
        <div className="jobs-page">
            <h1 className='fw-bold fs-25 mb-1 text-center text-dark title'>What job are you working on?</h1>

            <div className="jobs">
                {jobsList.map(j => {
                    return(
                        <button className="btn btn-lg btn-secondary" key={j.name}>
                            {j.name}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Jobs