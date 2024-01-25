import { useUserInfo } from "./UserProvider"

import { useState, useEffect } from "react"

const Break = () => {

    const [breaks, setBreaks] = useState([])
    const user = useUserInfo()

    const getBreaks = async () => {
        const module = await import("./useDB")
        const makeRequest = module.makeRequest

        const output = await makeRequest({ employee_number: user.userInfo.employee_number }, '/getbreaks', sessionStorage.getItem('token'))
        setBreaks(output.output)
    }

    useEffect(() => {
        getBreaks()
    }, [])

    return(
        <>
            {
                breaks.length === 0 ?
                <h5 className="text-center text-muted">You are not taking a break at the moment...</h5> :
                breaks.map(b => {
                    return(
                        <div key={b.start}>
                            <h3>{b.break_type}</h3>
                            <p>{b.start}</p>
                        </div>
                    )
                })
            }
        </>
    )
}

export default Break