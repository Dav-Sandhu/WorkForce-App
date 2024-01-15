import * as faceapi from '@vladmandic/face-api'

export const loadModels = async () => {
    
    const MODEL_URL = '/'

    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)

    return 1
}

export const compareFaces = async (face1, face2) => {

    const img1 = await faceapi.fetchImage(face1)
    const img2 = await faceapi.fetchImage(face2)

    const detection1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor()
    const detection2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor()

    if (!detection1 || !detection2) {
        console.error('No face Detected!')
        return false
    }

    const distance = faceapi.euclideanDistance(detection1.descriptor, detection2.descriptor)
    return distance < 0.6
}