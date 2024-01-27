import { useState, useEffect } from 'react'

import { useUserInfo } from './UserProvider'

export function convertToTime(dateString) {
    const date = new Date(dateString)
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const amOrPm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')

    return `${formattedHours}:${minutes} ${amOrPm}`
}

export function getClockInTime(clock_in) {

    // Create a Date object from the clock_in time
    const clockInDate = new Date(clock_in)

    // Calculate the difference between the current time and the clock_in time
    let timeDifference = (new Date()) - clockInDate

    //to ensure it is never negative
    timeDifference = Math.max(0, timeDifference)

    const hours = Math.floor(timeDifference / (1000 * 60 * 60)).toString().padStart(2, '0')
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000).toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
}

function Clock() {

    const user = useUserInfo()
    
    const clock_in = user.userInfo.clock_in
    const clock_out = user.userInfo.clock_out

    const [time, setTime] = useState(
        clock_in === null ?
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
        clock_out === null ?
        "Hours Worked: " + getClockInTime(clock_in) :
        "" 
    )

    useEffect(() => {
        const interval = setInterval(() => {

            if (clock_in !== null && clock_out === null){
                setTime("Hours Worked: " + getClockInTime(clock_in))
            }else{
                setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            }
            
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return <>{time}</>
}

export default Clock
