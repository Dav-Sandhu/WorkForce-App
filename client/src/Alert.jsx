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