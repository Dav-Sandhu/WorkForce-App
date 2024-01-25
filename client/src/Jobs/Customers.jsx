import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider"

const Customers = ({ selectedJob }) => {
    
    const navigate = useNavigate()
    const user = useUserInfo()

    const [customers, setCustomers] = useState([])

    useEffect(() => {

        const request = async () => {
            const token = sessionStorage.getItem('token')

            if (token !== null){
                const module = await import('../useDB')
                const makeRequest = module.makeRequest

                const customersList = await makeRequest(null, '/getcustomers', token)
                customersList.status === 1 ? setCustomers(customersList.output) : navigate('/')
            }else{navigate('/login')}
        }

        request()
    }, [])
    
    return(
        <>
            {customers.map((customer) => {
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
                                    const date = new Date(output.output[0].start)
                                    console.log(date)
                                }else{
                                    alert('You already did this job today!')
                                }
                            }

                            request()
                            
                        }}>
                        <img
                            className="img-fluid company-logo" 
                            src={customer.logo} 
                            alt="Company Logo" />
                        <h4 className="h5 text-nowrap">
                            {customer.business_name}
                        </h4>
                    </div>
                )
            })}
        </>
    )
}

export default Customers;