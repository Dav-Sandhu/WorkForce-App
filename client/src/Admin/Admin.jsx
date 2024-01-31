import './Admin.scss'

import { useState, lazy } from "react" 

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const ClockTable = lazy(() => import('./ClockTable'))
const BreakTable = lazy(() => import('./BreakTable'))

import Navbar from './Navbar'

const Admin = () => {

    const [startDate, setStartDate] = useState(new Date())
    const [clockTimes, setClockTimes] = useState([])
    const [breakTimes, setBreakTimes] = useState([])
    const [profiles, setProfiles] = useState({})
    const [headings, setHeadings] = useState([])

    let footer = []

    const getReport = async (selectedDate) => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const output = await makeRequest({ date: selectedDate }, '/getreport', sessionStorage.getItem('token'))

        footer = []

        if (output.status === 1){

            let tempClock = []
            let tempBreak = []

            Object.entries(output.output).forEach(([key, value]) => {
                if(key !== "headings"){

                    const clockValues = value.clock
                    const breakValues = value.breaks

                    clockValues.forEach(o => {
                        o.name = value.first_name + ' ' + value.last_name
                        o.employee_number = key
                    })

                    breakValues.forEach(o => {
                        o.name = value.first_name + ' ' + value.last_name
                        o.employee_number = key
                    })

                    tempClock = tempClock.concat(clockValues)
                    tempBreak = tempBreak.concat(breakValues)
                }
            })  

            setProfiles(output.output)
            setHeadings(output.output.headings)
            setClockTimes(tempClock)
            setBreakTimes(tempBreak)
        }
    }

    return(
        <>
            <Navbar />
            <label htmlFor="datePicker">Select A Date:</label>
            <DatePicker id="datePicker" selected={startDate} onChange={(date) => {
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
                    {
                        clockTimes.length > 0 ? 
                            <>
                                <h3>Daily Clock In</h3>
                                <ClockTable clocks={clockTimes} />
                            </> : "" 
                    }
                    {
                        breakTimes.length > 0 ?
                            <>
                                <h3>Daily Breaks</h3>
                                <BreakTable breaks={breakTimes} />
                            </> : ""
                    }
                </div>
            }
        </>
    )
}

export default Admin