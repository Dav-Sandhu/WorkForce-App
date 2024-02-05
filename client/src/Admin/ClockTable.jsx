//displays the clock in table which keeps track of the employees clock in and clock out times
const ClockTable = ({clocks}) => {

    return(
        <table className="table">
            <thead className="table-dark">
                <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">Clock In</th>
                    <th scope="col">Clock Out</th>
                    <th scope="col">Total</th>
                </tr>
            </thead>
            <tbody>{
                clocks.map(clock => {

                    const clockIn = new Date(clock.clock_in)
                    const clockOut = clock.clock_out === null ? "-" : new Date(clock.clock_out)

                    const diff = clock.clock_out === null ? "-" : clockOut - clockIn

                    const formatTime = (diff) => {
                        const hours = Math.floor(diff / 1000 / 60 / 60) 
                        const minutes = Math.floor((diff / 1000 / 60) % 60)
                        const seconds = Math.round((diff / 1000) % 60)
                    
                        return `${hours}h: ${minutes}m: ${seconds}s`
                    }

                    return(
                        <tr>
                            <th
                                className="table-active employee_name"
                                scope="row" 
                                onClick={() => {
                                    import('../Alert').then(async module => {
                                        await module.customAlert("Employee Number: " + clock.employee_number, "", "info")
                                    })
                                }}>{clock.name}</th>
                            <td>{clockIn.toLocaleTimeString()}</td>
                            <td>{clock.clock_out === null ? "-" : clockOut.toLocaleString()}</td>
                            <td>{clock.clock_out === null ? "-" : formatTime(diff)}</td>
                        </tr>
                    )
                })
            }</tbody>
        </table>
    )
}

export default ClockTable