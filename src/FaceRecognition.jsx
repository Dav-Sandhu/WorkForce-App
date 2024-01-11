import { useState, useEffect, useRef } from 'react'
import "./FaceRecognition.scss"

import * as faceapi from '@vladmandic/face-api'
import Webcam from 'react-webcam'

const compareFaces = async (face1, face2) => {

    const img1 = await faceapi.fetchImage(face1)
    const img2 = await faceapi.fetchImage(face2)

    const detection1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor()
    const detection2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor()

    if (!detection1 || !detection2) {
        console.error('No face Detected!')
        return false
    }

    const distance = faceapi.euclideanDistance(detection1.descriptor, detection2.descriptor)
    console.log(distance)
    return distance < 0.6
}

const FaceRecognition = () => {

    const [img1, setImg1] = useState(null)
    const [img2, setImg2] = useState(null)

    const camRef = useRef(null)

    const img1Ref = useRef()
    const img2Ref = useRef()

    const captureScreenshot = () => {
        setImg1(camRef.current.getScreenshot())
    }

    const handleUpload = (setImg, e) => {
        setImg(URL.createObjectURL(e.target.files[0]))
    }


    useEffect(() => {
        const loadModels = async (MODEL_URL) => {
          await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
          await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        }
      
        loadModels('/node_modules/@vladmandic/face-api/model')
      }, [])
    

    return(
        <>
            {img1 && <img ref={img1Ref} src={img1} alt="Uploaded" />}
            {img2 && <img ref={img2Ref} src={img2} alt="Uploaded" />}

            <button onClick={async () => {
                if (img1Ref && img2Ref){
                    const output = await compareFaces(img1Ref.current.src, img2Ref.current.src)
                    console.log(output)
                    alert(output ? "Same Person" : "Different People")
                }
            }}>Compare Faces</button><br />

            <Webcam 
                ref={camRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
                }}
            /> <br />

            <button onClick={captureScreenshot}>
                Take Picture
            </button> <br />

            <input type="file" accept="image/*" onChange={(e) => handleUpload(setImg1, e)} />
            <input type="file" accept="image/*" onChange={(e) => handleUpload(setImg2, e)} />
        </>
    )
}

export default FaceRecognition