const tf = require('@tensorflow/tfjs')
const faceapi = require('@vladmandic/face-api')
const { Image, createCanvas, loadImage } = require('canvas')
faceapi.env.monkeyPatch({ Canvas: createCanvas, Image })

async function loadImageAndCreateCanvas(url) {
    try{
        const img = await loadImage(url)
        const canvas = createCanvas(img.width, img.height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)

        return canvas
    }catch(error) {
        console.error('An image was found to be broken.')
    }
}

const loadModels = async (path) => {

    const MODEL_URL = path.join(__dirname, 'models')

    //loads models needed for face-api library to function
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL)
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL)

    return 1
}

const compareFaces = async (face1, face2) => {

    //one or more of the faces are missing
    if (!face1 || !face2) {
        return 1
    }

    //processes the given images and returns a canvas object
    const img1 = await loadImageAndCreateCanvas(face1)
    const img2 = await loadImageAndCreateCanvas(face2)
    
    //converts the canvas object to a tensor object
    const tensor1 = tf.browser.fromPixels(img1)
    const tensor2 = tf.browser.fromPixels(img2)  
    
    //there was a problem processing the images
    if (!img1 || !img2) {
        return 1
    }

    //detects the face in the image and returns a descriptor object
    const detection1 = await faceapi.detectSingleFace(tensor1).withFaceLandmarks().withFaceDescriptor()
    const detection2 = await faceapi.detectSingleFace(tensor2).withFaceLandmarks().withFaceDescriptor()

    //no face was detected in one or more of the images
    if (!detection1 || !detection2) {
        return 1
    }

    //returns a value between 1 and 0, the smaller it is the closer alike the faces are
    const distance = faceapi.euclideanDistance(detection1.descriptor, detection2.descriptor)

    return distance
}

module.exports = { loadModels, compareFaces }