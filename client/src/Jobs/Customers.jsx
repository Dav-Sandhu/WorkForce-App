import { useEffect, useState, lazy } from "react"
import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider"

const Spinner = lazy(() => import('../Spinner'))

const Customers = ({ selectedJob }) => {
    
    const navigate = useNavigate()
    const user = useUserInfo()

    const [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([])

    const loaded = (customers) => {
        setLoading(false)
        setCustomers(customers)
    }

    useEffect(() => {

        const request = async () => {
            const token = sessionStorage.getItem('token')

            if (token !== null){
                const module = await import('../useDB')
                const makeRequest = module.makeRequest

                const customersList = await makeRequest(null, '/getcustomers', token)
                customersList.status === 1 ? loaded(customersList.output) : navigate('/')
            }else{navigate('/login')}
        }

        request()
    }, [])
    
    return(
        <>
            {loading ? <Spinner /> : customers.length === 0 ? 
            <h5 className="text-center text-muted">There are no customers available right now...</h5> : 
                customers.map((customer) => {
                    return(
                        <div
                            className='customer' 
                            key={customer.business_name + customer.contact_email}
                            onClick={() => {
                                const request = async () => {
                                    const module = await import('../useDB')
                                    const makeRequest = module.makeRequest

                                    const output = await makeRequest({
                                        employee_number: user.userInfo.employee_number,
                                        process_type: selectedJob,
                                        business_name: customer.business_name,
                                        contact_email: customer.contact_email
                                    }, '/startjob', null)

                                    if (output.status === 1){
                                        navigate('/working')
                                    }else{
                                        import('../Alert').then(async module => {
                                            await module.customAlert("Something Went Wrong!", "Please try again later.", "error")
                                        })
                                    }
                                }

                                request()
                                
                            }}>
                            <img
                                className="img-fluid company-logo" 
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