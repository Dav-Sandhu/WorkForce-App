import './Update.scss'

import { useReducer, useState, useEffect, lazy } from "react"
import Navbar from './Navbar'

const Currency = lazy(() => import('./Currency'))

const reducer = (state, {type, payload}) => {
    switch(type){

        case "business_name":
            return {
                ...state,
                business_name: payload
            }
        case "logo":
            return {
                ...state,
                logo: payload
            }
        case "contact_name":
            return {
                ...state,
                contact_name: payload
            }
        case "contact_email":
            return {
                ...state,
                contact_email: payload
            }
        case "currency":
            return {
                ...state,
                currency: payload
            }
        case "process_type":
            return {
                ...state,
                process_type: payload
            }
        case "billable":
            return {
                ...state,
                billable: !state.billable
            }
        case "hourly_rate":
            return {
                ...state,
                hourly_rate: parseFloat(payload)
            }
        case "hourly_wage":
            return {
                ...state,
                hourly_wage: parseFloat(payload)
            }
        case "employee_number":
            return {
                ...state,
                employee_number: payload
            }

        default:
            return state
    }
}

const Update = () => {

    const [state, dispatch] = useReducer(reducer, {
        business_name:"",
        logo: "",
        contact_name: "",
        contact_email: "",
        process_type: "",
        billable: false,
        hourly_rate: 0.0,
        hourly_wage: 0.0,
        employee_number: '',
        currency: "CAD"
    })

    const [view, setView] = useState("customers")
    const [displayItems, setDisplayItems] = useState([])

    const getInfo = async () => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const token = sessionStorage.getItem('token')

        if (view === "customers"){
            const output = await makeRequest(null, '/getcustomers', token)
            setDisplayItems(output.output)
        }else if (view === "processes"){
            const output = await makeRequest(null, '/getinternalprocesses', token)
            setDisplayItems(output.output)
        }else if (view === "employees"){
            const output = await makeRequest(null, '/getemployees', token)
            setDisplayItems(output.output)
        }
    }

    useEffect(() => {
        getInfo()
    }, [view])

    const statusCheck = async (status, msg) => {

        const module = await import('../Alert')
        const customAlert = module.customAlert

        if (status === 1){
            await customAlert(msg, "", "success")
        }else{
            await customAlert("Something Went Wrong!", "Please try again.", "error")
        }
    }

    const removeInfo = async (type, item) => {

        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        if(type === "customers"){
            const output = await makeRequest({
                business_name: item.business_name,
                contact_email: item.contact_email
            }, '/deletecustomer', null)

            await statusCheck(output.status, "Customer Deleted!")

        }else if (type === "processes"){
            const output = await makeRequest({
                process_type: item.process_type
            }, '/deleteinternalprocess', null)

            await statusCheck(output.status, "Process Deleted!")

        }else if (type === "employees"){
            const output = await makeRequest({ 
                employee_number: item.employee_number 
            }, '/removeemployee', null)

            await statusCheck(output.status, "Employee Deleted!")

        }

        window.location.reload()
    }

    const addInfo = async () => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        if (view === "customers" 
            && state.business_name.length > 0 
                && state.contact_email.length > 0
                    && state.contact_name.length > 0
                        && state.currency.length > 0){
            const output = await makeRequest({
                business_name: state.business_name,
                logo: state.logo,
                contact_name: state.contact_name,
                contact_email: state.contact_email,
                currency: state.currency
            }, '/addcustomer', null)

            await statusCheck(output.status, "Customer Added!")

        }else if (view === "processes" && state.process_type.length > 0){

            const output = await makeRequest({
                process_type: state.process_type,
                billable: state.billable ? 1 : 0,
                hourly_rate: state.billable ? state.hourly_rate : null 
            }, '/addinternalprocess', null)

            await statusCheck(output.status, "Process Added!")

        }else if (view === "employees" && state.employee_number.length > 0){

            const output = state.employee_number.length > 0 ? await makeRequest({
                employee_number: state.employee_number,
                hourly_wage: state.hourly_wage
            }, '/updateemployeewage', null) : { status: -1 }
            
            await statusCheck(output.status, "Employee Updated!")

        }

        window.location.reload()
    }

    const handleUpdate = (e) => {
        dispatch({
            type: e.target.id,
            payload: e.target.value
        })
    }

    return(
        <>
            <Navbar />
            <section className="h-100 h-custom update-section">

                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-8 col-xl-6">
                            <button 
                                type="button" 
                                className="btn btn-dark btn-lg mb-1"
                                onClick={() => {
                                    setView(prev => {
                                        if (prev === "employees"){return "customers"}
                                        else if (prev === "customers"){return "processes"}
                                        
                                        return "employees"
                                    })
                                }}>{
                                view === "customers" ? "Switch to Processes" : view === "employees" ? "Switch to Customers" : "Switch to Employees"
                            }</button>
                            
                            <div className="display-items">{
                                displayItems.map(item => {
                                    
                                    const type = item.hasOwnProperty('business_name') ? "customers" : 
                                    item.hasOwnProperty('process_type') ? "processes" : "employees"

                                    return(
                                        <div 
                                            className="display-item"
                                            key={type === "customers" ? 
                                                item.business_name + item.contact_email : 
                                                type === "processes" ? item.process_type :
                                                item.employee_number
                                            }>
                                                {
                                                    type === "customers" ?
                                                    <>
                                                        <div className="card">
                                                            <div className="logo-section">
                                                                <img 
                                                                    className="company-logo card-img-top" 
                                                                    src={item.logo} 
                                                                    alt="Card image cap" />
                                                            </div>
                                                            <div className="card-body">
                                                                <h5 className="card-title overflow-hidden">{item.business_name}</h5>
                                                                <p className="mb-0 overflow-hidden">{item.contact_name}</p>
                                                                <p className="mb-0 overflow-hidden">{item.contact_email}</p>
                                                                <p className="mb-0 overflow-hidden">Currency: {item.currency}</p>
                                                                <button 
                                                                    type="button" 
                                                                    className="btn btn-danger"
                                                                    onClick={() => {
                                                                        removeInfo(type, item)
                                                                    }}>delete</button>
                                                            </div>
                                                        </div>
                                                    </> : type === "processes" ?
                                                    <>
                                                        <div className="card-header p-4 pb-0">
                                                            <h3 className="mb-0 overflow-hidden">{item.process_type}</h3>
                                                        </div>
                                                        <div className="card-body p-4 pt-0">
                                                            <p className="mb-0 overflow-hidden">Billable: {item.billable ? "Yes" : "No"}</p>
                                                            <p className="mb-0 overflow-hidden">Hourly Rate: {item.hourly_rate}</p>
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-danger"
                                                                onClick={() => {
                                                                    removeInfo(type, item)
                                                                }}>delete</button>
                                                        </div>
                                                    </> : 
                                                    <>
                                                        <div className="card">
                                                            <div className="profile-picture-section">
                                                                <img 
                                                                    className="profile-picture card-img-top" 
                                                                    src={item.picture.length > 0 ? item.picture : "/default profile picture.jpg"} 
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
                                                                        removeInfo(type, item)
                                                                    }}>delete</button>
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                        </div>
                                    )
                                })
                            }</div>
                        </div>
                    </div>
                </div>

                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-8 col-xl-6">
                            <div className="card rounded-3">
                                <div className="card-body p-4 p-md-5">

                                    <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">
                                        {view === "customers" ? "Add Customer" : view === "processes" ? "Add Proccess" : "Update Employee"}
                                    </h3>

                                    <form className="px-md-2">
                                        {
                                            view === "customers" ?
                                            <>
                                                <div className="form-outline mb-4">
                                                    <input 
                                                        type="text" 
                                                        id="business_name" 
                                                        className="form-control"
                                                        value={state.business_name}
                                                        onChange={handleUpdate} />
                                                    <label className="form-label" htmlFor="business_name">Business Name</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input 
                                                        type="text" 
                                                        id="logo" 
                                                        className="form-control"
                                                        value={state.logo}
                                                        onChange={handleUpdate} />
                                                    <label className="form-label" htmlFor="logo">Link to Logo Image</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input 
                                                        type="text" 
                                                        id="contact_name" 
                                                        className="form-control"
                                                        value={state.contact_name}
                                                        onChange={handleUpdate} />
                                                    <label className="form-label" htmlFor="contact_name">Contact Name</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <div className="input-group mb-2">
                                                        <div className="input-group-prepend">
                                                            <div className="input-group-text">@</div>
                                                        </div>
                                                        <input 
                                                            type="email" 
                                                            id="contact_email" 
                                                            className="form-control"
                                                            value={state.contact_email}
                                                            onChange={handleUpdate} />
                                                    </div>
                                                    <label className="form-label" htmlFor="contact_email">Contact Email</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <Currency handleUpdate={handleUpdate} value={state.currency} />
                                                </div>
                                            </> : view === "processes" ?
                                            <>
                                                <div className="form-outline mb-4">
                                                    <input 
                                                        type="text" 
                                                        id="process_type" 
                                                        className="form-control"
                                                        value={state.process_type}
                                                        onChange={handleUpdate} />
                                                    <label className="form-label" htmlFor="process_type">Process Type</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <div className="form-check mb-2">
                                                        <input 
                                                            className="form-check-input" 
                                                            type="checkbox" 
                                                            id="billable"
                                                            checked={state.billable}
                                                            onChange={() => {dispatch({ type: 'billable', value: '' })}} />
                                                        <label className="form-check-label" htmlFor="billable">
                                                            Billable?
                                                        </label>
                                                    </div>
                                                </div>

                                                {
                                                    state.billable ? 
                                                    <div className="form-outline mb-4">
                                                        <div className="input-group mb-2">
                                                            <div className="input-group-prepend">
                                                                <div className="input-group-text">$</div>
                                                            </div>
                                                            <input 
                                                                type="number" 
                                                                step="0.01"
                                                                id="hourly_rate" 
                                                                className="form-control"
                                                                value={state.hourly_rate}
                                                                onChange={handleUpdate} />
                                                        </div>
                                                        <label className="form-label" htmlFor="hourly_rate">Hourly Rate</label>
                                                    </div> : ""
                                                }
                                            </> : 
                                            <>
                                                <div className="form-outline mb-4">
                                                    <select 
                                                        className="form-select" 
                                                        id="employee_number"
                                                        name="employee_number"
                                                        value={state.employee_number}
                                                        onChange={handleUpdate}>
                                                            <option>select employee number</option>
                                                            {
                                                            displayItems.map(item => {
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
                                                            value={state.hourly_wage}
                                                            onChange={handleUpdate} />
                                                    </div>
                                                    <label className="form-label" htmlFor="hourly_wage">Hourly Wage</label>
                                                </div>
                                            </>
                                        }

                                    </form>

                                    <button 
                                        type="button" 
                                        className="btn btn-success btn-lg mb-1"
                                        onClick={() => {
                                            addInfo()
                                        }}
                                        >{view === "employees" ? "Update" : "Add"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Update