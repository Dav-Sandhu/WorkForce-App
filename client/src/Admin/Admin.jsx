import './Admin.scss'

import { useState, useEffect, lazy } from "react" 

//for downloading the table data as a csv file
import { CSVLink } from 'react-csv'

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
    const [employeeSelector, setEmployeeSelector] = useState('')
    const [clockTimes, setClockTimes] = useState([])
    const [breakTimes, setBreakTimes] = useState([])
    const [profiles, setProfiles] = useState({})
    const [headings, setHeadings] = useState([])
    const [selectFlag, setSelectFlag] = useState('')

    const [csvData, setCsvData] = useState([])
    const [csvHeaders, setCsvHeaders] = useState([])

    const formatTime = (s) => {
        const h = Math.floor(s / 3600)
        const m = Math.floor((s % 3600) / 60)
        const remaining = Math.round(s % 60)

        let outputStr = ``
        h > 0 ? outputStr += `${h}h:` : ""
        m > 0 ? outputStr += `${m}m:` : ""
        remaining > 0 ? outputStr += `${remaining}s` : ""
        
        return outputStr
    }

    useEffect(() => {
        if (selectFlag === 'employees' && headings.length > 0){
            const data = Object.keys(profiles).map((key) => {
                if (key !== 'headings') {
                    const row = {}
                    const hours = new Array(headings.length).fill(0)
            
                    profiles[key].values.forEach(task => {
                        const index = headings.indexOf(task.business_name)
            
                        if (task.finish !== null) {
                            const diff = new Date(task.finish) - new Date(task.start)
                            hours[index] += diff
                        }
                    })
            
                    hours[hours.length - 1] = hours.reduce((a, b) => a + b, 0)
                    let total = 0
                    for (let i = 0; i < hours.length; i++) {

                        total += headings[i] !== 'total' && headings[i] !== 'employee' ? hours[i] : 0
                        let t = headings[i] === 'total' ? total : hours[i]

                        const h = Math.floor(t / 1000 / 60 / 60)
                        const m = Math.floor((t / 1000 / 60) % 60)
                        const s = Math.round((t / 1000) % 60)

                        let outputStr = ``
                        h > 0 ? outputStr += `${h}h:` : ""
                        m > 0 ? outputStr += `${m}m:` : ""
                        s > 0 ? outputStr += `${s}s` : ""

                        const convertedTime = hours[i] === 0 ? '' : outputStr
                        row[headings[i]] = headings[i] === 'employee' ? 
                        profiles[key].first_name + ' ' + profiles[key].last_name : 
                        convertedTime
                    }
            
                    return row
                }
            }).filter(Boolean)

                // Create a new row for the footer
                const footerRow = {}
                footerRow[headings[0]] = "Total"
                footer.forEach((f, i) => {
                    const h = Math.floor(f / 1000 / 60 / 60)
                    const m = Math.floor((f / 1000 / 60) % 60)
                    const s = Math.round((f / 1000) % 60)
                    let timeStr = ``
                    h > 0 ? timeStr += `${h}h:` : ""
                    m > 0 ? timeStr += `${m}m:` : ""
                    s > 0 ? timeStr += `${s}s` : ""
                    footerRow[headings[i + 1]] = timeStr
                })

                // Add the footer row to the data
                data.push(footerRow)

            const headers = headings.map(h => ({ label: h, key: h }))

            setCsvData(data)
            setCsvHeaders(headers)
        }else if (selectFlag === 'customers' && headings.length > 0){
            const data = Object.keys(profiles.data).map((key) => {
                const row = {}
                row['hours by activity'] = key

                profiles['headings'].forEach(h => {
                    const seconds = profiles.work.filter(w => w.business_name === h && w.process_type === key).reduce((total, w) => total + w.time, 0)

                    if (h === 'total hours'){
                        row[h] = formatTime(profiles.data[key].totalWork)
                    }else if (h === 'hourly rate'){
                        const hourly_rate = profiles.data[key].hourly_rate || ""
                        row[h] = hourly_rate > 0 ? '$' + hourly_rate : ""
                    }else if (h === 'total revenue'){
                        const hourly_rate = profiles.data[key].hourly_rate
                        const totalWork = profiles.data[key].totalWork
                        const revenue = hourly_rate !== null ? '$' + (hourly_rate * (totalWork / 60 / 60)).toFixed(2) : ''
                        
                        row[h] = revenue
                    }else if (h !== 'hours by activity'){
                        row[h] = seconds > 0 ? formatTime(seconds) : ""
                    }
                })

                return row
            }).filter(Boolean)

            const headers = headings.map(h => ({ label: h, key: h }))

            setCsvData(data)
            setCsvHeaders(headers)
        }else if (selectFlag === 'employeebycustomer' && headings.length > 0 && profiles[employeeSelector] !== undefined){
            const data = Object.keys(profiles[employeeSelector].data).map((key) => {
                const row = {}
                row['hours by activity'] = key 

                profiles['headings'].forEach(h => {
                    const seconds = profiles[employeeSelector].work.filter(w => w.business_name === h && w.process_type === key).reduce((total, w) => total + w.time, 0)

                    if (h === 'total hours'){
                        row[h] = formatTime(profiles[employeeSelector].data[key].totalWork)
                    }else if (h === 'hourly rate'){
                        const hourly_rate = profiles[employeeSelector].data[key].hourly_rate || ""
                        row[h] = hourly_rate > 0 ? '$' + hourly_rate : ""
                    }else if (h === 'total revenue'){
                        const hourly_rate = profiles[employeeSelector].data[key].hourly_rate
                        const totalWork = profiles[employeeSelector].data[key].totalWork
                        const revenue = hourly_rate !== null ? '$' + (hourly_rate * (totalWork / 60 / 60)).toFixed(2) : ''
                        
                        row[h] = revenue
                    }else if (h !== 'hours by activity'){
                        row[h] = seconds > 0 ? formatTime(seconds) : ""
                    }
                })

                return row
            }).filter(Boolean)

            const headers = headings.map(h => ({ label: h, key: h }))

            setCsvData(data)
            setCsvHeaders(headers)
        }else if (clockTimes.length > 0){
            const data = clockTimes.map(clock => {
                const clockIn = new Date(clock.clock_in)
                const clockOut = clock.clock_out === null ? "" : new Date(clock.clock_out)
                const diff = clock.clock_out === null ? "" : clockOut - clockIn

                const h = Math.floor(diff / 1000 / 60 / 60) 
                const m = Math.floor((diff / 1000 / 60) % 60)
                const s = Math.round((diff / 1000) % 60)

                return {
                    Employee: clock.name,
                    'Clock In': clockIn.toLocaleString(),
                    'Clock Out': clock.clock_out === null ? "" : clockOut.toLocaleString(),
                    Total: clock.clock_out === null ? "" : `${h}h: ${m}m: ${s}s`
                }
            })

            const headers = [
                { label: 'Employee', key: 'Employee' },
                { label: 'Clock In', key: 'Clock In' },
                { label: 'Clock Out', key: 'Clock Out' },
                { label: 'Total', key: 'Total' }
            ]

            setCsvData(data)
            setCsvHeaders(headers)
        }else if (breakTimes.length > 0){

            const data = breakTimes.map(b => {
                const start = new Date(b.start)
                const finish = b.finish === null ? "-" : new Date(b.finish)
                const diff = b.finish === null ? "-" : finish - start

                const h = Math.floor(diff / 1000 / 60 / 60) 
                const m = Math.floor((diff / 1000 / 60) % 60)
                const s = Math.round((diff / 1000) % 60)

                return {
                    Employee: b.name,
                    'Break Type': b.break_type,
                    Start: start.toLocaleString(),
                    Finish: b.finish === null ? "" : finish.toLocaleString(),
                    Total: b.finish === null ? "" : `${h}h: ${m}m: ${s}s`
                }
            })

            const headers = [
                { label: 'Employee', key: 'Employee' },
                { label: 'Break Type', key: 'Break Type' },
                { label: 'Start', key: 'Start' },
		        { label: 'Finish', key: 'Finish' },
                { label: 'Total', key: 'Total' }
            ]

            setCsvData(data)
            setCsvHeaders(headers)
        }
    }, [profiles, employeeSelector])

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
                if(key !== "headings" && selectedTable !== 'customers' && selectedTable !== 'employeebycustomer'){

                    const values = value.values

                    values.forEach(o => {
                        o.name = value.first_name + ' ' + value.last_name
                        o.employee_number = key
                    })

                    temp = temp.concat(values)
                }
            })  

            //clears the downloadable csv data
            setCsvData([])
            setCsvHeaders([])

            //sets the profiles, headings, clock times, and break times
            setProfiles(output.output)
            setSelectFlag(selectedTable)

            if(selectedTable === 'employees' || selectedTable === 'customers' || selectedTable === 'employeebycustomer'){
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
                        <option value="customers">Customer Report</option>
                        <option value="employeebycustomer">Employee By Customer Report</option>
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
                        selectFlag === 'employees' && headings.length > 0 ? 
                        <>
                            <h3>Employee Staffing Report</h3> 

                            <CSVLink
                                data={csvData}
                                headers={csvHeaders}
                                filename={"employees.csv"}
                                target="_blank"
                            >
                                Download table
                            </CSVLink>

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
                                                                await module.customAlert("Employee Information", 'Email: ' + profiles[key].email, "info")
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
                        selectFlag === 'customers' && headings.length > 0 ? 
                        <>
                            <h3>Customer Report</h3> 

                            <CSVLink
                                data={csvData}
                                headers={csvHeaders}
                                filename={"customers.csv"}
                                target="_blank"
                            >
                                Download table
                            </CSVLink>

                            <table className="table">
                                <thead className="table-dark">
                                    <tr>
                                        { headings.length > 0 ? headings.map(h => { return <th scope="col">{h}</th> }) : "" }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(profiles.data).map((key) => {

                                            return(
                                                <>
                                                    <tr>
                                                        <th className="table-active" scope="row">{key}</th>
                                                        {profiles['headings'].map(h => {

                                                            const seconds = profiles.work.filter(w => w.business_name === h && w.process_type === key).reduce((total, w) => total + w.time, 0)
                                                        
                                                            if(h === 'hours by activity'){return ""}
                                                            else if (h === 'total hours'){ 
                                                                const totalTimeFormatted = formatTime(profiles.data[key].totalWork)
                                                                return <td>{totalTimeFormatted.length > 0 ? totalTimeFormatted : "-"}</td>
                                                            }
                                                            else if (h === 'hourly rate'){ 

                                                                const hourly_rate = profiles.data[key].hourly_rate || "-"

                                                                return <td>{hourly_rate !== "-" ? '$' + hourly_rate : "-"}</td> 
                                                            }else if (h === 'total revenue'){ 

                                                                const hourly_rate = profiles.data[key].hourly_rate
                                                                const totalWork = profiles.data[key].totalWork

                                                                const revenue = hourly_rate !== null ? 
                                                                '$' + (hourly_rate * (totalWork / 60 / 60)).toFixed(2) : '-'

                                                                return <td>{revenue}</td> 
                                                            }

                                                            return(
                                                                <td>{seconds > 0 ? formatTime(seconds) : "-"}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </> : selectFlag === 'employeebycustomer' && headings.length > 0 ? 
                        <>
                            <h3>Employee By Customer Report</h3> 

                            <select 
                                name="employeeSelector" 
                                id="employeeSelector"
                                value={employeeSelector}
                                onChange={(e) => setEmployeeSelector(e.target.value)}>
                                <option>Select an Employee</option>
                                {Object.keys(profiles).map((key) => {

                                    if (key === 'headings' || key === 'data' || key === 'work'){return <></>}
                                    
                                    return (
                                        <option value={key}>
                                            {profiles[key].first_name + ' ' + profiles[key].last_name}
                                        </option>
                                    )
                                })}
                            </select> <br />

                            {
                                profiles[employeeSelector] !== undefined ?
                                <CSVLink
                                    data={csvData}
                                    headers={csvHeaders}
                                    filename={profiles[employeeSelector].first_name + " " + profiles[employeeSelector].last_name + " By Customer.csv"}
                                    target="_blank"
                                >
                                    Download table
                                </CSVLink> : ""
                            }

                            <table className="table">
                                <thead className="table-dark">
                                    <tr>
                                        { headings.length > 0 ? headings.map(h => { return <th scope="col">{h}</th> }) : "" }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        profiles[employeeSelector] !== undefined ?
                                        Object.keys(profiles[employeeSelector].data).map((key) => {
                                            return(
                                                <tr>
                                                    <th className="table-active" scope="row">{key}</th>
                                                    {
                                                        profiles['headings'].map(h => {

                                                            const seconds = profiles[employeeSelector].work.filter(w => w.business_name === h && w.process_type === key).reduce((total, w) => total + w.time, 0)
                                                            
                                                            if(h === 'hours by activity'){return ""}
                                                            else if (h === 'total hours'){ return <td>{formatTime(profiles[employeeSelector].data[key].totalWork)}</td>}
                                                            else if (h === 'hourly rate'){ 

                                                                const hourly_rate = profiles[employeeSelector].data[key].hourly_rate || "-"

                                                                return <td>{hourly_rate !== "-" ? '$' + hourly_rate : "-"}</td> 
                                                            }else if (h === 'total revenue'){ 

                                                                const hourly_rate = profiles[employeeSelector].data[key].hourly_rate
                                                                const totalWork = profiles[employeeSelector].data[key].totalWork

                                                                const revenue = hourly_rate !== null ? 
                                                                '$' + (hourly_rate * (totalWork / 60 / 60)).toFixed(2) : '-'

                                                                return <td>{revenue}</td> 
                                                            }

                                                            return(
                                                                <td>{seconds > 0 ? formatTime(seconds) : "-"}</td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            )
                                        }) : ""
                                    }
                                </tbody>
                            </table>
                        </> : ""
                    }
                    {
                        clockTimes.length > 0 ? 
                            <>
                                <h3>Clock In Table</h3>
                                <CSVLink
                                    data={csvData}
                                    headers={csvHeaders}
                                    filename={"clock_ins.csv"}
                                    target="_blank"
                                >
                                    Download table
                                </CSVLink>
                                <ClockTable clocks={clockTimes} />
                            </> : "" 
                    }
                    {
                        breakTimes.length > 0 ?
                            <>
                                <h3>Breaks Table</h3>
                                <CSVLink
                                    data={csvData}
                                    headers={csvHeaders}
                                    filename={"breaks.csv"}
                                    target="_blank"
                                >
                                    Download table
                                </CSVLink>
                                <BreakTable breaks={breakTimes} />
                            </> : ""
                    }
                </div>
            }
        </Navbar>
    )
}

export default Admin