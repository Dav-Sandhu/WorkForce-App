import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import './Update.scss'

const Employees = () => {

    const token = sessionStorage.getItem('token')

    const [display, setDisplay] = useState([])

    const [employeeNumber, setEmployeeNumber] = useState("")
    const [hourlyWage, setHourlyWage] = useState(0.0)

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
                                                        <p className="mb-0 overflow-hidden">{'#' + item.employee_number}</p>
                                                        <p className="mb-0 overflow-hidden">{item.email}</p>
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
                                                    <option>select employee number</option>
                                                    {
                                                    display.map(item => {
                                                        return(
                                                            <option key={item.employee_number} value={item.employee_number}>{item.employee_number}</option>
                                                        )
                                                    })
                                                    }
                                            </select>
                                        </div>

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
                                    </form>

                                    <button type="button" className="btn btn-success btn-lg mb-1" onClick={() => {
                                        const request = async () => {
                                            const module = await import('../useDB')
                                            const makeRequest = module.makeRequest

                                            const output = employeeNumber.length > 0 ? await makeRequest({
                                                employee_number: employeeNumber,
                                                hourly_wage: hourlyWage
                                            }, '/updateemployeewage', token, "post") : { status: -1 }
                                            
                                            await statusCheck(output.status, "Employee Updated!")
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