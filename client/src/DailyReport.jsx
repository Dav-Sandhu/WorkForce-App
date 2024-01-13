import { useState } from "react"
import { makeRequest } from "./useDB"

const DailyReport = () => {

    const [report, setReport] = useState([])

    const getReport = async () => {
        const result = await makeRequest(JSON.stringify({ 
            type: "daily-report", 
            values: [] 
        }))
        
        return result
    }

    getReport()

    return(
        <>
            {report.map(row => {
                return(
                    <div key={row.employee_number}>
                        
                    </div>
                )
            })}
        </>
    )
}

export default DailyReport