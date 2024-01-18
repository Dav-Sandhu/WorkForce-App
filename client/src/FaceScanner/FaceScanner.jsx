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
                const faceModule = await import('./FaceRecognition')
                const dbModule = await import('../useDB')

                //models needed for the face-api ai to function
                await faceModule.loadModels()

                const makeRequest = dbModule.makeRequest

                //retrieves a list of all profile pictures to compare the taken picture to
                const images_list = await makeRequest( null, '/pictures', null )

                let matches = false
                let match_num = 0
                let closest = 1

                //iterates through the images list
                for (let i = 0;i < images_list.length;i++){

                    //since some users don't have images this try and catch block ensures there is no error
                    try{

                        /*
                        compares the images and returns a number, the smaller the number is the more the two faces are alike
                        if the number is smaller than 0.6 there is a high likelyhood that the two faces belong to the same person,
                        but as it is imperfect, sometimes it can be wrong which is why there exists a closest value to return only
                        the one match that gave the smallest value.
                        */
                        let match = await faceModule.compareFaces(image, images_list[i].picture)
                        matches = (match < 0.6) ? true : matches
                        match_num = (match < closest) ? i : match_num
                        closest = (match < closest) ? match : closest
                    }catch(e){
                        //profile doesn't have a picture or profile picture is corrupted
                    }
                }

                if (matches){
                    //creates a jwt token to reference the database information of the user the picture belongs to
                    const token = await makeRequest({ picture: images_list[match_num].picture }, '/facematch', null)
                    sessionStorage.setItem('token', token.token)

                    //decyphers the token and updates the current user state object to the values of the token
                    const tokenLogin = await import("../TokenLogin")
                    tokenLogin.default(token.token, makeRequest, () => navigate('/'), user)
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