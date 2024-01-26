import { useEffect } from 'react'

const Admin = () => {

    const getReport = async () => {
        const module = await import('../useDB')
        const makeRequest = module.makeRequest

        //const output = await makeRequest()
    }

    useEffect(() => {
        getReport()
    }, [])

    return(
        <></>
    )
}

export default Admin