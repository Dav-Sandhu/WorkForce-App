import './FaceScanner.scss'

import Webcam from 'react-webcam'

import { useRef } from 'react'
import { loadModels, compareFaces } from "./FaceRecognition"

const FaceScanner = ({state, dispatch, makeRequest, navigate}) => {

    const camRef = useRef(null)
    console.log(state.image)

    return(
        <>
            <h1 className='fw-bold fs-25 mb-1 text-center text-dark title'>Or Scan face to login instead!</h1>
            
            <button 
                type="button" 
                className="btn btn-danger"
                onClick={(e) => {

                    const image = camRef.current.getScreenshot()

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
                }}>Scan
            </button><br />
            {state.image === null ? 
                <Webcam 
                    ref={camRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        width: 1280,
                        height: 720,
                        facingMode: "user"
                    }}
                /> :
                <img className="user-picture" src={state.image} />
            }
        </>
    )
}

export default FaceScanner