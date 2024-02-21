import { useState, useEffect, useReducer } from 'react'
import Navbar from './Navbar'
import Currency from './Currency'
import './Update.scss'

const reducer = (state, { type, payload }) => {
    switch(type){

        case "currency":
            return {
                ...state,
                currency: payload
            }
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
        default:
            return state
    }
}

const UpdateCustomers = () => {

    const token = sessionStorage.getItem('token')

    const [display, setDisplay] = useState([])

    const [state, dispatch] = useReducer(reducer, {
        currency: "",
        business_name: "",
        logo: "",
        contact_name: "",
        contact_email: ""
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

        const customers = await makeRequest(null, '/getcustomers', token, "get")
        setDisplay(customers.output)
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
                                            <div className="display-item" key={item.business_name + item.contact_email}>
                                                <div className="card">
                                                    <div className="logo-section">
                                                        <img 
                                                            className="company-logo card-img-top"
                                                            loading="lazy" 
                                                            onError={(e) => {e.target.onerror = null; e.target.src="/customers.png"}}
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
                                                                const request = async () => {
                                                                    const module = await import('../useDB')
                                                                    const makeRequest = module.makeRequest

                                                                    const output = await makeRequest({
                                                                        business_name: item.business_name,
                                                                        contact_email: item.contact_email
                                                                    }, '/deletecustomer', token, "post")
                                                        
                                                                    await statusCheck(output.status, "Customer Deleted!")

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
                                    <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Add Customer</h3>

                                    <form className="px-md-2">
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
                                    </form>

                                    <button type="button" className="btn btn-success btn-lg mb-1" onClick={() => {
                                        const request = async () => {
                                            const module = await import('../useDB')
                                            const makeRequest = module.makeRequest

                                            const output = await makeRequest({
                                                business_name: state.business_name,
                                                logo: state.logo,
                                                contact_name: state.contact_name,
                                                contact_email: state.contact_email,
                                                currency: state.currency
                                            }, '/addcustomer', token, "post")
                                
                                            await statusCheck(output.status, "Customer Added!")
                                            window.location.reload()
                                        }

                                        if (state.business_name.length > 0 && state.contact_email.length > 0 && state.contact_name.length > 0 && state.currency.length > 0){
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

export default UpdateCustomers