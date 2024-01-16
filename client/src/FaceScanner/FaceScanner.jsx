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

                for (let i = 0;i < images_list.length;i++){
                    let match = await faceModule.compareFaces(image, images_list[i].picture)

                    matches = match ? true : matches
                    match_num = match ? i : match_num
                }

                if (matches){

                    const token = await makeRequest({ picture: images_list[match_num].picture }, '/facematch', null)
                    const out = await makeRequest(null, '/userInfo', token)

                    if (out.length > 0){
                        sessionStorage.setItem('token', token.token)

                        user.setUserInfo({
                            employee_number: out[0].employee_number,
                            first_name: out[0].first_name,
                            last_name: out[0].last_name,
                            email: out[0].email,
                            password: out[0].password,
                            hourly_wage: out[0].hourly_wage,
                            picture: out[0].picture
                        })
    
                        navigate('/')
                    }else{alert("Something went wrong...")}
                }else{
                    alert("face not recognized!")
                }
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
                    <img className="user-picture mb-5" src={state.image} />}
                </div>
            }
        </>
    )
}

export default FaceScanner