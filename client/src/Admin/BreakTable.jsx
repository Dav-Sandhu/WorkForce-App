//displays the breaks table which keeps track of the employees break times
const BreakTable = ({breaks}) => {
    
    return(
        <table className="table">
            <thead className="table-dark">
                <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">Break Type</th>
                    <th scope="col">Start</th>
                    <th scope="col">Finish</th>
                    <th scope="col">Total</th>
                </tr>
            </thead>
            <tbody>{
                breaks.map(b => {

                    const start = new Date(b.start)
                    const finish = b.finish === null ? "-" : new Date(b.finish)

                    const diff = b.finish === null ? "-" : finish - start

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
                                onClick={() => {

                                    import('../Alert').then(async module => {
                                        await module.customAlert('Employee Number: ' + b.employee_number, "", "info")
                                    })
                                    
                                }}
                            >{b.name}</th>
                            <td>{b.break_type}</td>
                            <td>{start.toLocaleTimeString()}</td>
                            <td>{b.finish === null ? "-" : finish.toLocaleString()}</td>
                            <td>{formatTime(diff)}</td>
                        </tr>
                    )
                })
            }</tbody>
        </table>
    )
}

export default BreakTable