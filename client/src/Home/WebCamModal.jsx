import './WebCamModal.scss'

import { forwardRef, useState } from "react"

import Webcam from "react-webcam"

import { useUserInfo } from '../UserProvider'

//modal for taking and updating the user's profile picture
const WebCamModal = ({ setWebcamActive }, ref) => {

    const user = useUserInfo()

    //used to make sure that the webcam is loaded before loading the modal UI
    const [webcamLoaded, setWebcamLoaded] = useState(false)
    
    return(
        <div className='webcam-modal'>
            {/*close button for exiting the modal*/}
            {webcamLoaded && (<button 
                className='btn btn-danger btn-rounded close-webcam-button'
                onClick={() => setWebcamActive(false)}>x</button>)}

            {/*webcam element that takes 500x500 images*/}
            <Webcam
                audio={false}
                ref={ref}
                height={'100%'}
                width={'100%'}
                screenshotFormat="image/jpeg"
                screenshotSize={{ width: 500, height: 500 }}
                onUserMedia={() => setWebcamLoaded(true)} 
            />

            {webcamLoaded && (
                <button
                    className='take-picture btn btn-success btn-rounded btn-lg'
                    onClick={() => {

                        //needed to uniquely identify the user
                        const employee_number = user.userInfo.employee_number

                        //consistent naming scheme for the uploaded images
                        const name = user.userInfo.first_name + '-' + user.userInfo.last_name + '-' + employee_number + '.jpg'
                        
                        //gets the screenshot from the webcam
                        const src = ref.current.getScreenshot()

                        const image = new Image()
                        image.src = src

                        image.onload = async () => {
                            const canvas = document.createElement('canvas')
                            const ctx = canvas.getContext('2d')
                            
                            //ensures that the image is 500x500
                            canvas.width = 500
                            canvas.height = 500
                            ctx.drawImage(image, 0, 0, 500, 500)
                            const resizedImage = canvas.toDataURL()

                            const module = await import('../useDB')
                            const makeRequest = module.makeRequest
                        

                            //once the image is processed and resized it will upload the image to the server
                            const output = await makeRequest({ 
                                name, 
                                image: resizedImage, 
                                employee_number, 
                                token: sessionStorage.getItem('token') 
                            }, '/upload-image', sessionStorage.getItem('token'), 'post')
                            
                            if (output.status === 1){
                                //if the upload was successful it will update the user's profile picture
                                const token = output.token

                                sessionStorage.removeItem('token')
                                sessionStorage.setItem('token', token)

                                //alert the user that the picture was updated
                                const alertModule = await import('../Alert')
                                const customAlert = alertModule.customAlert
                                await customAlert('Success!', 'Picture updated.', 'success')
                            }else{
                                //if the upload was unsuccessful it will alert the user to try again later
                                const alertModule = await import('../Alert')
                                const customAlert = alertModule.customAlert
                                await customAlert('Picture Failed To Upload!', 'Please try again later.', 'error')
                            }

                            window.location.reload()
                        }
                    }}
                >Take Picture</button>
            )}
        </div>
    )
}

export default forwardRef(WebCamModal)