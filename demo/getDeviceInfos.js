import Ffmpeg from '../ffmpeg.js'

// Get device list
let deviceList = await Ffmpeg.listDevices()
let device     = deviceList[0]

// Retrieve devices features
await device.detectFeatures()

// Print devices features
device.infos()