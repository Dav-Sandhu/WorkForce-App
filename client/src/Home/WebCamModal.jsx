import './WebCamModal.scss'

import { forwardRef, useState } from "react"

import Webcam from "react-webcam"

import { useUserInfo } from '../UserProvider'

const WebCamModal = ({ setWebcamActive }, ref) => {

    const user = useUserInfo()

    const [webcamLoaded, setWebcamLoaded] = useState(false)
    
    return(
        <div className='webcam-modal'>
            {webcamLoaded && (<button 
                className='btn btn-danger btn-rounded close-webcam-button'
                onClick={() => setWebcamActive(false)}>x</button>)}
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

                        const employee_number = user.userInfo.employee_number
                        const name = user.userInfo.first_name + '-' + user.userInfo.last_name + '-' + employee_number + '.jpg'
                        const src = ref.current.getScreenshot()

                        const image = new Image()
                        image.src = src

                        image.onload = async () => {
                            const canvas = document.createElement('canvas')
                            const ctx = canvas.getContext('2d')
                            canvas.width = 500
                            canvas.height = 500
                            ctx.drawImage(image, 0, 0, 500, 500)
                            const resizedImage = canvas.toDataURL()

                            const module = await import('../useDB')
                            const makeRequest = module.makeRequest
                        
                            const output = await makeRequest({ name, image: resizedImage, employee_number }, '/upload-image', null)
                            
                            if (output.status === 1){

                                user.setUserInfo({
                                    ...user.userInfo,
                                    picture: output.picture
                                })

                                const alertModule = await import('../Alert')
                                const customAlert = alertModule.customAlert
                                await customAlert('Success!', 'Picture updated.', 'success')
                            }else{
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