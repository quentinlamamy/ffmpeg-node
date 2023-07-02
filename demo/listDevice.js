import Ffmpeg from '../ffmpeg.js'

let deviceList = await Ffmpeg.listDevices()
console.log(deviceList.map(d => "[" + d.index + "] " + d.name))