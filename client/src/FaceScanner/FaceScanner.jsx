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
            dispatch({
                type: "image",
                payload: image
            })

            const compareImages = async () => {

                const faceModule = await import('./FaceRecognition')
                const dbModule = await import('../useDB')

                await faceModule.loadModels()

                const makeRequest = dbModule.makeRequest

                const images_list = await makeRequest( null, '/pictures', null )

                let matches = false
                let match_num = 0
                let closest = 1

                for (let i = 0;i < images_list.length;i++){
                    try{
                        let match = await faceModule.compareFaces(image, images_list[i].picture)
                        matches = (match < 0.6) ? true : matches
                        match_num = (match < closest) ? i : match_num
                        closest = (match < closest) ? match : closest
                    }catch(e){
                        //profile doesn't have a picture or profile picture is corrupted
                    }
                }

                if (matches){
                    const token = await makeRequest({ picture: images_list[match_num].picture }, '/facematch', null)
                    sessionStorage.setItem('token', token.token)

                    const tokenLogin = await import("../TokenLogin")
                    tokenLogin.default(token.token, makeRequest, navigate, user)
                }else{
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