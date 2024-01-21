import './FaceScanner.scss'

import { useRef, useState, lazy } from 'react'

const Webcam = lazy(() => import('react-webcam'))

const FaceScanner = ({state, dispatch, navigate, user}) => {

    const [scanner, setScanner] = useState(false)
    const [enableScanText, setEnableScanText] = useState(false)
    const camRef = useRef(null)

    const scan = () => {
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
                const res = await makeRequest({ image }, '/facematch', null)

                if (res.status === 1){
                    const token = res.token

                    sessionStorage.setItem('token', token)

                    //decyphers the token and updates the current user state object to the values of the token
                    const tokenLogin = await import("../TokenLogin")
                    tokenLogin.default(token, makeRequest, () => navigate('/'), user)
                }else{
                    //if face is not recognized it will alert the user and refresh the page
                    alert("face not recognized!")
                    window.location.reload()  
                }
            }

            compareImages()
        }else{
            alert("Failed to capture picture, try again!")
            window.location.reload()
        }
    }

    return(
        <>
            <hr className="mt-2 mb-3"/>
            {/*
            button will prompt the user if they would like to instead scan their face to login rather 
            than manually sign in. 
            */}
            {
                !scanner ? 
                <div className="d-grid gap-2">
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={(e) => {
                            setScanner(true)
                        }}
                    >Or Scan your face to login!</button>
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
                                videoConstraints={{ facingMode: "user" }}
                            />
                            {enableScanText ? <div className="scan-text">
                                Scan
                            </div> : ""}
                        </div> :
                        <div>
                            <h2>Loading...</h2>
                            <img src={state.image} className="img-fluid user-picture mb-5" />
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default FaceScanner