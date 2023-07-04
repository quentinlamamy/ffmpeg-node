import Ffmpeg from '../ffmpeg.js'

let deviceList = await Ffmpeg.listDevices()

let device = deviceList[0]

await device.detectFeatures()

let filename = await device.takeVideo("test.avi",10)
console.log("File created: " + filename)