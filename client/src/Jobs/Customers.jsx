import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Customers = () => {
    
    const navigate = useNavigate()

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
                        key={customer.business_name + customer.contact_email}>
                        <img
                            className="img-fluid company-logo" 
                            src={customer.logo} 
                            alt="Company Logo" />
                        <h4>{customer.business_name}</h4>
                    </div>
                )
            })}
        </>
    )
}

export default Customers;