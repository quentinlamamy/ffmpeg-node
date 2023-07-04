import Ffmpeg from '../ffmpeg.js'

let deviceList = await Ffmpeg.listDevices()

let device = deviceList[3]

await device.detectFeatures()

let filename = await device.takePicture()
console.log("File created: " + filename)