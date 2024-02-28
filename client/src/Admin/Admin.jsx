import './Admin.scss'

import { useState, lazy } from "react" 

//imports the date picker library which is used to select a date for the daily reports
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const ClockTable = lazy(() => import('./ClockTable'))
const BreakTable = lazy(() => import('./BreakTable'))

import Navbar from './Navbar'

//displays the admin page which allows the admin to view the daily staffing report
const Admin = () => {

    const [startDate, setStartDate] = useState(new Date())
    const [finishDate, setFinishDate] = useState(new Date())
    const [selectedTable, setSelectedTable] = useState('employees')
    const [clockTimes, setClockTimes] = useState([])
    const [breakTimes, setBreakTimes] = useState([])
    const [profiles, setProfiles] = useState({})
    const [headings, setHeadings] = useState([])

    //footer section of the daily staffing report table which displays the total hours for each column
    let footer = []

    //gets the reports for the selected date
    const getReport = async () => {

        const start = (new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).toISOString().split('T')[0]
        const finish = (new Date(finishDate.getFullYear(), finishDate.getMonth(), finishDate.getDate())).toISOString().split('T')[0]

        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const output = await makeRequest({ 
            start, 
            finish, 
            selectedTable  
        }, '/getreport', sessionStorage.getItem('token'), 'get')

        //clears the footer section of the daily staffing report table
        footer = []

        if (output.status === 1){

            //clears the clock and break times
            let temp = []

            //loops through the output and adds the clock and break times to the tempClock and tempBreak arrays
            Object.entries(output.output).forEach(([key, value]) => {
                if(key !== "headings"){

                    const values = value.values

                    values.forEach(o => {
                        o.name = value.first_name + ' ' + value.last_name
                        o.employee_number = key
                    })

                    temp = temp.concat(values)
                }
            })  

            //sets the profiles, headings, clock times, and break times
            setProfiles(output.output)

            if(selectedTable === 'employees'){
                setBreakTimes([])
                setClockTimes([])
                setHeadings(output.output.headings)
            }else if(selectedTable === 'clocks'){
                setBreakTimes([])
                setHeadings([])
                setClockTimes(temp)
            }else if(selectedTable === 'breaks'){
                setClockTimes([])
                setHeadings([])
                setBreakTimes(temp)
            }
        }
    }

    return(
        <Navbar>
            <div className='m-2'>
                <div className='mb-2'>
                    <label htmlFor="startDate">From: </label>
                    <DatePicker id="startDate" selected={startDate} onChange={(date) => {
                        setStartDate(date)
                        //getReport((new Date(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0])
                    }} />
                </div>

                <div className='mb-2'>
                    <label htmlFor="finishDate">To: </label>
                    <DatePicker id="finishDate" selected={finishDate} onChange={(date) => {
                        setFinishDate(date)
                        //getReport((new Date(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0])
                    }} />
                </div>

                <div className='mb-2'> 
                    <label htmlFor="selectedTable">Select a Table: </label>
                    <select 
                        name="selectedTable" 
                        id="selectedTable"
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}>
                        <option value="employees">Employee Staffing Report</option>
                        <option value="clocks">Employee Clock Times</option>
                        <option value="breaks">Employee Break Times</option>
                    </select>
                </div>

                <button
                    type='button'
                    className='btn btn-dark mb-2'
                    onClick={getReport}
                >Submit</button>
            </div>

            {
                profiles.length === 0 ? "" : 
                <div className="table-responsive">
                    {
                        headings.length > 0 ? 
                        <>
                            <h3>Daily Staffing Report</h3> 

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
                                            
                                            //to keep track of the index of the headings array
                                            let hours = new Array(headings.length).fill(0)
                                            
                                            //inserts the work hours for each company at the correct index
                                            profiles[key].values.forEach(task => {
                                                const index = headings.indexOf(task.business_name)

                                                if (task.finish !== null){
                                                    const diff = new Date(task.finish) - new Date(task.start)
                                                    hours[index] += diff
                                                }
                                            })

                                            //adds the total hours worked at each company for each employee
                                            hours[hours.length - 1] = hours.reduce((a, b) => a + b, 0)

                                            //formats the output
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

                                                            import('../Alert').then(async module => {
                                                                await module.customAlert("Employee Information", 'Employee Number: ' + key + '\n' + 'Email: ' + profiles[key].email + '\nHourly Wage: $' + profiles[key].hourly_wage, "info")
                                                            })

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
                        </>
                        : 
                        ""
                    }
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
        </Navbar>
    )
}

export default Admin