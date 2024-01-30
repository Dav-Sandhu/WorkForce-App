import './Admin.scss'

import { useState } from "react" 

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import Navbar from './Navbar'

const Admin = () => {

    const [startDate, setStartDate] = useState(new Date())
    const [profiles, setProfiles] = useState({})
    const [headings, setHeadings] = useState([])
    let footer = []

    const getReport = async (selectedDate) => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const output = await makeRequest({ date: selectedDate }, '/getreport', sessionStorage.getItem('token'))
        footer = []

        if (output.status === 1){
            setProfiles(output.output)
            setHeadings(output.output.headings)
        }
    }

    return(
        <>
            <Navbar />
            <DatePicker selected={startDate} onChange={(date) => {
                setStartDate(date)
                getReport((new Date(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0])
            }} />
            {
                profiles.length === 0 ? "" : 
                <div className="table-responsive">
                    {headings.length > 0 ? <h3>Daily Staffing Report</h3> : ""}
                    <table className="table">
                        <thead className="table-dark">
                            <tr>
                                { headings.length > 0 ? headings.map(h => { return <th scope="col">{h}</th> }) : "" }
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(profiles).map((key) => {

                                let out = []

                                if (key !== 'headings'){
                                    
                                    let hours = new Array(headings.length).fill(0)
                                    
                                    profiles[key].work.forEach(task => {
                                        const index = headings.indexOf(task.business_name)

                                        if (task.finish !== null){
                                            const diff = new Date(task.finish) - new Date(task.start)
                                            hours[index] += diff
                                        }
                                    })

                                    hours[hours.length - 1] = hours.reduce((a, b) => a + b, 0)

                                    for (let i = 1;i < hours.length;i++){
                                        
                                        if (i - 1 > footer.length - 1){
                                            footer.push(hours[i])
                                        }else{
                                            footer[i-1] += hours[i]
                                        }

                                        const convertedTime = hours[i] === 0 ? '-' : `
                                        ${ Math.floor(hours[i] / 1000 / 60 / 60) }h:
                                        ${ Math.floor((hours[i] / 1000 / 60) % 60) }m:
                                        ${ Math.round((hours[i] / 1000) % 60) }s
                                        `

                                        out.push(convertedTime)
                                    }
                                }
                                
                                return(
                                    <>
                                        {key === "headings" ? "" : 
                                        <tr>
                                            <th 
                                                className="table-active employee_name"
                                                scope="row" 
                                                onClick={() => {
                                                    alert('employee_number: ' + key + '\n' + 'email: ' + profiles[key].email + '\nhourly wage: $' + profiles[key].hourly_wage)
                                                }}>{
                                                    profiles[key].first_name + ' ' + profiles[key].last_name
                                                }
                                            </th>
                                            { key !== 'headings' ? out.map(o => { 
                                                return <td>{o}</td> 
                                            }) : "" }
                                        </tr>
                                        }
                                    </>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            {
                                footer.length > 0 ? 
                                <tr>
                                    <th scope="row">Total</th>
                                    { footer.map(f => { return <td>{`
                                        ${ Math.floor(f / 1000 / 60 / 60) }h:
                                        ${ Math.floor((f / 1000 / 60) % 60) }m:
                                        ${ Math.round((f / 1000) % 60) }s
                                    `}</td> }) }
                                </tr> : ""
                            }
                        </tfoot>
                    </table>
                </div>
            }
        </>
    )
}

export default Admin