import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import './Update.scss'

const Employees = () => {

    const token = sessionStorage.getItem('token')

    const [display, setDisplay] = useState([])
    const [select, setSelect] = useState("wage")

    const [employeeNumber, setEmployeeNumber] = useState("")
    const [hourlyWage, setHourlyWage] = useState(0.0)
    const [breakTime, setBreakTime] = useState(0)
    const [lunchTime, setLunchTime] = useState(0)
    const [adpNumber, setAdpNumber] = useState("")
    const [supervisor, setSupervisor] = useState(false)

    //returns the status of the request
    const statusCheck = async (status, msg) => {

        const module = await import('../Alert')
        const customAlert = module.customAlert

        if (status === 1){
            await customAlert(msg, "", "success")
        }else{
            await customAlert("Something Went Wrong!", "Please try again.", "error")
        }
    }

    const initLoad = async () => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const employees = await makeRequest(null, '/getemployees', token, "get")
        setDisplay(employees.output)
    }

    useEffect(() => {
        initLoad()
    }, [])

    return(
        <Navbar>
            <section className="update-section">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-8 col-xl-6">
                            <div className="display-items">
                                {
                                    display.map((item) => {
                                        return(
                                            <div className="display-item" key={item.employee_number}>
                                                <div className="card">
                                                    <div className="profile-picture-section">
                                                        <img 
                                                            className="profile-picture card-img-top" 
                                                            loading="lazy"
                                                            src={item.picture} 
                                                            onError={(e) => {e.target.onerror = null; e.target.src="/default profile picture.jpg"}}
                                                            alt="Card image cap" />
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 className="card-title overflow-hidden">{item.first_name + ' ' + item.last_name}</h5>
                                                        {item.is_supervisor ? <p className="mb-0 overflow-hidden">Supervisor</p> : <p className="mb-0 overflow-hidden">Employee</p>}
                                                        <p className="mb-0 overflow-hidden">{"ADP Number: " + (item.adp_number || "NA")}</p>
                                                        <p className="mb-0 overflow-hidden">{item.email}</p>
                                                        <p className="mb-0 overflow-hidden">{'Break Time: ' + item.break_time + ' min'}</p>
                                                        <p className="mb-0 overflow-hidden">{'Lunch Time: ' + item.lunch_time + ' min'}</p>
                                                        <p className="mb-0 overflow-hidden">{'Hourly Wage: $' + item.hourly_wage}</p>
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-danger"
                                                            onClick={() => {
                                                                const request = async () => {

                                                                    const module = await import('../useDB')
                                                                    const makeRequest = module.makeRequest

                                                                    const output = await makeRequest({ 
                                                                        employee_number: item.employee_number,
                                                                        first_name: item.first_name,
                                                                        last_name: item.last_name 
                                                                    }, '/removeemployee', token, "post")

                                                                    await statusCheck(output.status, "Employee Deleted!")
                                                                    window.location.reload()
                                                                }

                                                                request()
                                                            }}>delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-8 col-xl-6">
                            <div className="card rounded-3">
                                <div className="card-body p-4 p-md-5">
                                    <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Update Employee</h3>
                                    <form className="px-md-2">
                                        <div className="form-outline mb-4">
                                            <select 
                                                className="form-select" 
                                                id="employee_number"
                                                name="employee_number"
                                                value={employeeNumber}
                                                onChange={(e) => setEmployeeNumber(e.target.value)}>
                                                    <option>select employee</option>
                                                    {
                                                    display.map(item => {
                                                        return(
                                                            <option key={item.employee_number} value={item.employee_number}>{
                                                                item.first_name + ' ' + item.last_name + ' (' + item.email + ')'
                                                            }</option>
                                                        )
                                                    })
                                                    }
                                            </select>
                                        </div>

                                        <h5>Select What to Update</h5>
                                        <div className="form-outline mb-4">
                                            <select 
                                                className="form-select" 
                                                id="select-updated-form"
                                                name="select-updated-form"
                                                value={select}
                                                onChange={(e) => setSelect(e.target.value)}>
                                                    <option value="wage">Hourly Wage</option>
                                                    <option value="supervisor">Employee Rank</option>
                                                    <option value="break">Break Times</option>
                                                    <option value="adp">ADP Number</option>
                                            </select>
                                        </div>

                                        {
                                            select === "supervisor" ?
                                            <div className="form-outline mb-4">
                                                <div className="form-check mb-2">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        id="select"
                                                        checked={supervisor}
                                                        onChange={() => setSupervisor(prev => !prev)} />
                                                    <label className="form-check-label" htmlFor="select">
                                                        Upgrade to Supervisor
                                                    </label>
                                                </div>
                                            </div> : select === "break" ?
                                            <>
                                                <div className="input-group mb-3">
                                                    <span className="input-group-text" id="break_time">Break Minutes</span>
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        step="1"
                                                        value={breakTime}
                                                        onChange={(e) => {

                                                            const value = parseInt(e.target.value) || 0

                                                            value >= 0 ? setBreakTime(value) : setBreakTime(0)
                                                        }} /> 
                                                </div>
                                                <div className="input-group mb-3">
                                                    <span className="input-group-text" id="lunch_time">Lunch Minutes</span>
                                                    <input 
                                                        type="number" 
                                                        className="form-control"
                                                        step="1"
                                                        value={lunchTime}
                                                        onChange={(e) => {

                                                            const value = parseInt(e.target.value) || 0

                                                            value >= 0 ? setLunchTime(value) : setLunchTime(0)
                                                        }} /> 
                                                </div>
                                            </> : select === "adp" ?
                                            <>
                                                <div className="input-group mb-3">
                                                    <span className="input-group-text" id="adp">Update ADP Number</span>
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        maxLength="3"
                                                        value={adpNumber}
                                                        onChange={(e) => setAdpNumber(e.target.value)} />
                                                </div>
                                            </> : select === "wage" ? 
                                            <>
                                                <div className="form-outline mb-4">
                                                    <div className="input-group mb-2">
                                                        <div className="input-group-prepend">
                                                            <div className="input-group-text">$</div>
                                                        </div>
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            id="hourly_wage" 
                                                            className="form-control"
                                                            value={hourlyWage}
                                                            onChange={(e) => setHourlyWage(e.target.value)} />
                                                    </div>
                                                    <label className="form-label" htmlFor="hourly_wage">Hourly Wage</label>
                                                </div> 
                                            </> : ""
                                        }

                                    </form>

                                    <button type="button" className="btn btn-success btn-lg mb-1" onClick={() => {
                                        const request = async () => {
                                            const module = await import('../useDB')
                                            const makeRequest = module.makeRequest

                                            if (select === "wage"){
                                                const output = employeeNumber.length > 0 ? await makeRequest({
                                                    employee_number: employeeNumber,
                                                    hourly_wage: hourlyWage
                                                }, '/updateemployeewage', token, "post") : { status: -1 }

                                                await statusCheck(output.status, "Employee Updated!")
                                            }else if (select === "supervisor"){
                                                const output = supervisor ? 
                                                await makeRequest({ employee_number: employeeNumber }, '/upgradeuser', token, "post") : 
                                                await makeRequest({ employee_number: employeeNumber }, '/downgradeuser', token, "post")
                                                
                                                await statusCheck(output.status, "Employee Updated!")
                                            }else if (select === "break"){
                                                const output = await makeRequest({ 
                                                    employee_number: employeeNumber,
                                                    break_time: breakTime,
                                                    lunch_time: lunchTime
                                                }, '/updatebreaktimes', token, "post")

                                                await statusCheck(output.status, "Employee Updated!")
                                            }else if (select === "adp"){
                                                const output = await makeRequest({
                                                    employee_number: employeeNumber,
                                                    adp_number: adpNumber
                                                }, '/updateadpnumber', token, "post")

                                                await statusCheck(output.status, "Employee Updated!")
                                            }
                                            
                                            window.location.reload()
                                        }

                                        request()
                                    }}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Navbar>
    )
}

export default Employees