import Ffmpeg from '../ffmpeg.js'

// Get device list
let deviceList = await Ffmpeg.listDevices()

// Print device list
console.log(deviceList.map(d => "[" + d.index + "] " + d.name))