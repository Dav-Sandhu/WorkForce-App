import './FaceScanner.scss'

import { useRef, useState, lazy } from 'react'

const Webcam = lazy(() => import('react-webcam'))
const Spinner = lazy(() => import('../Spinner'))

const FaceScanner = ({state, dispatch, navigate, user}) => {

    const [scanner, setScanner] = useState(false)
    const [enableScanText, setEnableScanText] = useState(false)
    const camRef = useRef(null)

    const scan = () => {

        //takes a picture of the user's face
        const image = camRef.current.getScreenshot()
       
        if(image){

            //updates the login state to reference the picture taken by the webcamera
            dispatch({
                type: "image",
                payload: image
            })

            const compareImages = async () => {

                //loading methods only when they are needed to save on loading times
                const module = await import('../useDB')
                const makeRequest = module.makeRequest

                //sends image to backend to compare to all images in database to determine if it matches
                const res = await makeRequest({ image }, '/facematch', null, "")

                if (res.status === 1){

                    const alertModule = await import('../Alert')
                    const customQuestionBox = alertModule.customQuestionBox

                    const ans = await customQuestionBox("Is This You?", res.name, "Yes", "No")
                    
                    const handler = async (password, token, user) => {
                        const module = await import('../useDB')
                        const makeRequest = module.makeRequest

                        const output = await makeRequest({ name: res.name, password }, '/checkpassword', null, "")
                        
                        if (output.output){
                            sessionStorage.setItem('token', token)

                            //decyphers the token and updates the current user state object to the values of the token
                            const tokenLogin = await import("../TokenLogin")
                            tokenLogin.default(token, makeRequest, () => navigate('/'), user)   
                        }else{
                            window.location.reload()
                        }
                    }

                    if (ans){
                        await alertModule.customInputAlert("Enter Your Password", handler, { token: res.token, user }) 
                    }else{ window.location.reload() }

                }else{
                    //if face is not recognized it will alert the user and refresh the page
                    import('../Alert').then(async module => {
                        await module.customAlert("Face Was Not Recognized!", "Please try again with better lighting with a more clear view of your face.", "error")
                        window.location.reload()  
                    }).catch(err => {
                        console.log(err)
                        window.location.reload()  
                    })
                }
            }

            compareImages()
        }else{

            //if the image was not taken it will alert the user and refresh the page
            import('../Alert').then(async module => {
                await module.customAlert("Failed To Capture Picture!", "Please try again.", "error")
                window.location.reload()
            }).catch(err => {
                console.log(err)
                window.location.reload()
            })
        }
    }

    return(
        <>
            {/*
            button will prompt the user if they would like to instead scan their face to login rather 
            than manually sign in. 
            */}
            {
                !scanner ? 
                <div className="d-grid gap-2 mb-5">
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={(e) => {
                            setScanner(true)
                        }}
                    >Scan your face to login!</button>
                </div>

                :
                <div className='image-area'>
                    {/*
                    if the image has been taken then it will show the image, otherwise it will show
                    the webcamera which you click on to take the picture.
                    */}
                    {state.image === null ? 
                        <div
                            className='camera mb-5'
                            onClick={scan}>
                            <Webcam 
                                ref={camRef}
                                screenshotFormat="image/jpeg"
                                onUserMedia={() => { setEnableScanText(true) }}
                                height={'100%'}
                                width={'100%'}
                                screenshotSize={{ width: 500, height: 500 }}
                                videoConstraints={{ facingMode: "user" }}
                            />
                            {enableScanText ? <div className="scan-text">
                                Click to Scan
                            </div> : ""}
                        </div> :
                        <div>
                            <Spinner />
                            <img src={state.image} className="img-fluid user-picture mb-5" />
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default FaceScanner