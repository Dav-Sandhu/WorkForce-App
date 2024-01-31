import Swal from 'sweetalert2'

export async function customAlert(title, msg, icon){
    await Swal.fire({
        title: title,
        text: msg,
        icon: icon
    })
}

export async function customQuestionBox(title, confirmBtn, rejectBtn){
    const result = await Swal.fire({
        title: title,
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