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

                    const clockIn = new Date(clock.start)
                    const clockOut = clock.finish === null ? "-" : new Date(clock.finish)

                    const diff = clock.finish === null ? "-" : clockOut - clockIn

                    const formatTime = (diff) => {
                        const hours = Math.floor(diff / 1000 / 60 / 60) 
                        const minutes = Math.floor((diff / 1000 / 60) % 60)
                        const seconds = Math.round((diff / 1000) % 60)
                    
                    
                        return `${hours}:${minutes}:${seconds}`
                    }

                    return(
                        <tr>
                            <th
                                className="table-active employee_name"
                                scope="row" 
                                onClick={() => alert('Employee Number: ' + clock.employee_number)}
                                >{clock.name}</th>
                            <td>{clockIn.toLocaleTimeString()}</td>
                            <td>{clock.finish === null ? "-" : clockOut.toLocaleString()}</td>
                            <td>{clock.finish === null ? "-" : formatTime(diff)}</td>
                        </tr>
                    )
                })
            }</tbody>
        </table>
    )
}

export default ClockTable