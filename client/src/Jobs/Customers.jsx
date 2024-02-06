import { useEffect, useState, lazy } from "react"
import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider"

const Spinner = lazy(() => import('../Spinner'))

//customers component for selecting the customer for which the user is doing the job for
const Customers = ({ selectedJob }) => {
    
    const navigate = useNavigate()
    const user = useUserInfo()

    const [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([])

    //adds the spinner while the content is loading
    const loaded = (customers) => {
        setLoading(false)
        setCustomers(customers)
    }

    const startJob = async (customer) => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        const output = await makeRequest({
            employee_number: user.userInfo.employee_number,
            process_type: selectedJob,
            business_name: customer.business_name,
            contact_email: customer.contact_email
        }, '/startjob', sessionStorage.getItem('token'), 'post')

        if (output.status === 1){
            navigate('/working')
        }else{
            import('../Alert').then(async module => {
                await module.customAlert("Something Went Wrong!", "Please try again later.", "error")
            })
        }
    }

    useEffect(() => {

        //loads all the customers
        const request = async () => {
            const token = sessionStorage.getItem('token')

            if (token !== null){
                const module = await import('../useDB')
                const makeRequest = module.makeRequest

                const customersList = await makeRequest(null, '/getcustomers', token, "get")
                customersList.status === 1 ? loaded(customersList.output) : navigate('/')
            }else{navigate('/login')}
        }

        request()
    }, [])
    
    return(
        <>
            {/*while the content is loading it will showcase a spinner*/}
            {loading ? <Spinner /> : customers.length === 0 ? 
            <h5 className="text-center text-muted">There are no customers available right now...</h5> : 
                customers.map((customer) => {
                    //outputs all the customers for the user to select from
                    return(
                        <div
                            className='customer' 
                            aria-label={'customer: ' + customer.business_name}
                            tabindex="0"
                            key={customer.business_name + customer.contact_email}
                            onKeyDown={e => e.key === "Enter" || e.key === " " ? startJob(customer) : ""}
                            onClick={() => startJob(customer)}>
                            <img
                                className="img-fluid company-logo" 
                                onError={(e) => {e.target.onerror = null; e.target.src="/customers.png"}}
                                src={customer.logo} 
                                alt="Company Logo" />
                            <h5 className="text-nowrap">
                                {customer.business_name}
                            </h5>
                        </div>
                    )
                })}
        </>
    )
}

export default Customers;