import { useState, useEffect, useReducer } from 'react'
import Navbar from './Navbar'
import './Update.scss'

const reducer = (state, { type, payload }) => {
    switch(type){

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
        default:
            return state
    }
}

const UpdateProcesses = () => {
    
    const token = sessionStorage.getItem('token')

    const [display, setDisplay] = useState([])

    const [state, dispatch] = useReducer(reducer, {
        process_type: "",
        billable: false,
        hourly_rate: 0.0
    })

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

        const processes = await makeRequest(null, '/getinternalprocesses', token, "get")
        setDisplay(processes.output)
    }

    const handleUpdate = (e) => {
        dispatch({
            type: e.target.id,
            payload: e.target.value
        })
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
                                    display.map(item => {
                                        return(
                                            <div className="display-item" key={item.process_type}>
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
                                                            const request = async () => {
                                                                const module = await import('../useDB')
                                                                const makeRequest = module.makeRequest

                                                                const output = await makeRequest({
                                                                    process_type: item.process_type
                                                                }, '/deleteinternalprocess', token, "post")
                                                    
                                                                await statusCheck(output.status, "Process Deleted!")

                                                                window.location.reload()
                                                            }

                                                            request()
                                                        }}>delete</button>
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
                                    <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Add Process</h3>
                                    
                                    <form className="px-md-2">
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
                                    </form>

                                    <button type="button" className="btn btn-success btn-lg mb-1" onClick={() => {
                                        const request = async () => {
                                            const module = await import('../useDB')
                                            const makeRequest = module.makeRequest

                                            const output = await makeRequest({
                                                process_type: state.process_type,
                                                billable: state.billable ? 1 : 0,
                                                hourly_rate: state.billable ? state.hourly_rate : null 
                                            }, '/addinternalprocess', token, "post")
                                
                                            await statusCheck(output.status, "Process Added!")
                                            window.location.reload()
                                        }

                                        if (state.process_type.length > 0){
                                            request()
                                        }else{
                                            const fillFields = async () => {
                                                const module = await import('../Alert')
                                                const customAlert = module.customAlert
                                                await customAlert("Please fill out all fields", "", "error")
                                            
                                            }
                                            
                                            fillFields()
                                        }
                                    }}>Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Navbar>
    )
}

export default UpdateProcesses