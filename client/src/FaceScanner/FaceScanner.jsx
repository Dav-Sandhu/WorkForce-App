import './FaceScanner.scss'

import Webcam from 'react-webcam'

import { useRef, useState } from 'react'
import { loadModels, compareFaces } from "./FaceRecognition"

const FaceScanner = ({state, dispatch, makeRequest, navigate}) => {

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

                await loadModels()

                const images_list = await makeRequest(JSON.stringify({ 
                    type: "picture", 
                    values: [] })
                )

                let matches = false

                for (let i = 0;i < images_list.length;i++){
                    let match = await compareFaces(image, images_list[i].picture)

                    matches = match ? true : matches
                }

                matches ? navigate('/Tasks') : alert("face not recognized!")
            }

            compareImages()
        }else{
            alert("Failed to capture picture, try again!")
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

                state.image === null ? 
                    <div
                        className='camera mb-5'
                        onClick={scan}>
                        <Webcam 
                            ref={camRef}
                            screenshotFormat="image/jpeg"
                            onUserMedia={() => {setEnableScanText(true)}}
                            videoConstraints={{
                                width: 1280,
                                height: 720,
                                facingMode: "user"
                            }}
                        />
                        {enableScanText ? <div className="scan-text">
                            Scan
                        </div> : ""}
                    </div> :
                <img className="user-picture mb-5" src={state.image} />
                
            }
        </>
    )
}

export default FaceScanner