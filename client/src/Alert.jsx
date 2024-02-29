import Swal from 'sweetalert2'

//most basic alert
export async function customAlert(title, msg, icon){
    await Swal.fire({
        title: title,
        text: msg,
        icon: icon
    })
}

//creates interactive alert with confirm and reject buttons
export async function customQuestionBox(title, msg, confirmBtn, rejectBtn){
    const result = await Swal.fire({
        title: title,
        text: msg,
        showDenyButton: true,
        confirmButtonText: confirmBtn,
        denyButtonText: rejectBtn
    }).then(res => {
        if (res.isConfirmed){
            return true
        }else if (res.isDenied){
            return false
        }
    })

    return result
}

//function checks to see if the break time is over, if so it will notify the user
export async function checkBreakStatus(timerId, seconds){
    const module = await import("./useDB")
    const makeRequest = module.makeRequest

    const finishBreak = await makeRequest({ seconds }, '/autoendbreak', sessionStorage.getItem("token"), "post")

    if(finishBreak.status === 1 && finishBreak.finishBreak){
        await customAlert('Warning!', 'Your break time is over.', 'warning')
        clearInterval(timerId)
        window.location.reload()
    }
}

//creates a timer that checks to see if the break time is over or not
export async function createBreakTimer(break_time, lunch_time){

    const module = await import("./useDB")

    const breaks = await module.makeRequest(null, '/getbreaks', sessionStorage.getItem("token"), "get")

    let timerId = null

    if(breaks.output.length > 0){

        const break_type = breaks.output[0].break_type
        const minutes = break_type === 'break' ? break_time : lunch_time
        const timeInSeconds = 60 * minutes

        await checkBreakStatus(timerId, timeInSeconds)
        timerId = setInterval(() => checkBreakStatus(timerId, timeInSeconds), 1000)
    }

    return timerId
}