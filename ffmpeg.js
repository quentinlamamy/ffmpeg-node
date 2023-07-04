import { exec } from 'child_process'
import Path from 'path'

/**
 * @class ffmpeg
 * @classdesc This class is a wrapper for the ffmpeg command line tool. It allows you to list available devices, detect their features and take pictures or videos.
 * @see Device
 * @see Mode
 */
class ffmpeg {

    /**
     * List available devices
     * @returns {Promise} Return an array of Device objects
     * @see Device
     */
    static async listDevices() {

        return new Promise((resolve, reject) => {

            let deviceList = []

            exec('ffmpeg -f avfoundation -list_devices true -i "" -hide_banner', async (error, stdout, stderr) => {

                let lines = error.message.split('\n')
                let currentType = null

                let currentCategory = null

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    if (line.includes('AVFoundation video devices:')) {
                        currentCategory = 'video'
                    } else if (line.includes('AVFoundation audio devices:')) {
                        currentCategory = 'audio'
                    } else {

                        let modes = []

                        let match = line.match(/\[(?<index>\d+)\] (?<name>.+)/);

                        if (match) {

                            if (match.groups.name.includes('screen')) { continue }

                            deviceList.push(new Device(match.groups.index, match.groups.name, currentCategory))
                        }

                    }

                }

                resolve(deviceList)

            })

        })

    }

}

export default ffmpeg

/**
 * @class Mode
 * @classdesc This class represents a mode for a device. A mode is a combination of resolution and framerate (min and max)
 * @see Device
 * @property {String} resolution The resolution of the mode
 * @property {String} framerateMin The minimum framerate of the mode
 * @property {String} framerateMax The maximum framerate of the mode
 */
class Mode {

    #resolution
    #framerateMin
    #framerateMax

    constructor(resolution, framerate) {
        this.#resolution = resolution
        this.#framerateMin = framerate.min
        this.#framerateMax = framerate.max
    }

    get width() { return this.#resolution.split('x')[0] }

    get height() { return this.#resolution.split('x')[1] }

    get fpsMin() { return this.#framerateMin }

    get fpsMax() { return this.#framerateMax }

    get resolution() { return this.#resolution }

    get framerate() { return this.#framerateMin + " - " + this.#framerateMax }

    toString() { return this.#resolution + " @ " + this.#framerateMin + " - " + this.#framerateMax }

}

/**
 * @class Device
 * @classdesc This class represents a device. A device can be a video or audio device.
 * @see Mode
 * @property {String} index The index of the device
 * @property {String} name The name of the device
 * @property {String} type The type of the device (video or audio)
 * @property {Array} modes The available modes for this device
 * @property {Array} pixelFormats The available pixel formats for this device
 */
class Device {

    #index
    #name
    #type
    #modes = []
    #pixelFormats = []

    constructor(index, name, type) {

        this.#index = index
        this.#name = name
        this.#type = type

    }

    /**
     * Detect available features for this devices. Features are stored in the #modes and #pixelFormats properties
     * @returns {Promise}
     */
    async detectFeatures() {

        if (this.#type == 'video') {
            await this.#detectModes()
            await this.#detectPixelFormats()
        }

    }

    /**
     * Detect available modes for this devices. Modes are stored in the #modes property
     * @tips: Modes are a combination of resolution and framerate (min and max)
     * @returns {Promise}
     */
    async #detectModes() {

        this.#modes = new Array()

        return new Promise((resolve, reject) => {

            exec(`ffmpeg -f avfoundation -i ${this.#index} -hide_banner`, (error, stdout, stderr) => {

                let lines = error.message.split('\n')

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    const match = line.matchAll(/(?<width>[\d]{3,4})x(?<height>[\d]{3,4})@\[(?<min>[\d.]+) (?<max>[\d.]+)\]fps/g);

                    if (match) {
                        for (const m of match) {

                            let mode = new Mode(m.groups.width + "x" + m.groups.height, { min: m.groups.min, max: m.groups.max })

                            this.#modes.push(mode)

                        }
                    }

                }

                this.#modes.sort((a, b) => {
                    const [aWidth, aHeight] = a.resolution.split('x').map(Number);
                    const [bWidth, bHeight] = b.resolution.split('x').map(Number);
                    return aWidth - bWidth;
                });

                resolve()

            })

        })

    }

    /**
     * Detect available pixel formats for this devices. Pixel formats are stored in the #pixelFormats property
     * @returns {Promise}
     */
    async #detectPixelFormats() {

        return new Promise((resolve, reject) => {

            exec(`ffmpeg -y -f avfoundation -framerate ${this.#modes[0].fpsMax} -video_size ${this.#modes[0].resolution} -i ${this.#index} -hide_banner`, (error, stdout, stderr) => {

                let lines = error.message.split('\n')

                for (let i = 0; i < lines.length; i++) {

                    const line = lines[i];
                    if (line.includes('Selected') || line.includes('Supported') || line.includes('Overriding') || line.includes("probesize")) { continue }

                    const match = line.matchAll(/\[avfoundation @ [a-z0-9]+\](?<pixelFormat>[ a-z0-9]+)/g);

                    if (match) {for (const m of match) {this.#pixelFormats.push(m.groups.pixelFormat.trim())}}
                }

                resolve()

            })

        })

    }

    /**
     * Check if a mode is supported by this device
     * @param {String} width 
     * @param {String} height 
     * @param {String} framerate 
     * @returns {Boolean}
     */
    testMode(width, height, framerate) {

        for (let i = 0; i < this.#modes.length; i++) {
            const mode = this.#modes[i];
            if (mode.width == width && mode.height == height && mode.fpsMin <= framerate && mode.fpsMax >= framerate) {
                return true
            }
        }

        return false
    }

    /**
     * Print available modes for this device
     * @returns {void}
     */
    listModes() {

        console.log("┌─────────────────────────────────────────────┐")
        console.log("│                   Modes                     │")
        console.log("├───────┬────────────┬────────────────────────┤")
        console.log("│ Index │ Resolution │       Framerate        │")
        console.log("├───────┼────────────┼────────────────────────┤")

        for (let i = 0; i < this.#modes.length; i++) {
            console.log("│   " + i.toString().padEnd("4", " ") + "│ " + this.#modes[i].resolution.padEnd("11", " ") + "│ " + this.#modes[i].framerate.padEnd("23", " ") + "│")
        }

        console.log("└───────┴────────────┴────────────────────────┘")

    }

    /**
     * Print available pixel formats for this device
     * @returns {void}
     */
    listPixelFormats() {

        console.log("┌─────────────────┐")
        console.log("│  Pixel Format   │")
        console.log("├───────┬─────────┤")
        console.log("│ Index │  Name   │")
        console.log("├───────┼─────────┤")

        for (let i = 0; i < this.#pixelFormats.length; i++) {
            console.log("│    " + i.toString().padEnd("3", " ") + "│ " + this.#pixelFormats[i].padEnd("8", " ") + "│")
        }

        console.log("└───────┴─────────┘")

    }

    /**
     * Print informations about this device
     * @returns {void}
     */
    infos() {

        console.log("Name : " + this.#name)
        console.log("Type : " + this.#type)
        console.log("Index: " + this.#index)
        console.log("")

        this.listModes()
        this.listPixelFormats()

    }

    /**
     * 
     * @param {String} output      - The output file path
     * @param {String} resolution  - The resolution of the picture
     * @param {String} pixelFormat - The pixel format of the picture
     * @returns {Promise}
     */
    takePicture(output = "output.jpg",resolution = this.#modes[this.#modes.length - 1].resolution, pixelFormat = this.#pixelFormats[0]) {

        let fps = fps = this.#modes[this.#modes.length - 1].fpsMax

        return new Promise((resolve, reject) => {

            if (this.testMode(resolution.split('x')[0], resolution.split('x')[1], fps)) {

                exec(`ffmpeg -y -f avfoundation -framerate ${fps} -video_size ${resolution} -i ${this.#index} -vframes 1 ${output} -pixel_format ${pixelFormat} -hide_banner`, (error, stdout, stderr) => {

                    resolve(Path.join(process.cwd(), output))

                })
            } else {
                reject('Mode not supported')
            }

        })

    }

    /**
     * Take a video with this device
     * @param {String} output      - The output file path
     * @param {Number} duration    - The duration of the video in seconds
     * @param {String} resolution  - The resolution of the video
     * @param {String} fps         - The framerate of the video
     * @param {String} pixelFormat - The pixel format of the video 
     * @returns {Promise}
     */
    takeVideo(output = "output.avi", duration = 1, resolution = this.#modes[this.#modes.length - 1].resolution, fps = this.#modes[this.#modes.length - 1].fpsMax, pixelFormat = this.#pixelFormats[0]) {

        let framesCount = duration * fps

        return new Promise((resolve, reject) => {

            if (this.testMode(resolution.split('x')[0], resolution.split('x')[1], fps)) {

                setTimeout(() => {resolve(Path.join(process.cwd(), output))},(duration + 1) * 1000)

                let elapsed = 0
                let interval = setInterval(() => {
                    elapsed++
                    
                    displayProgressBar(elapsed,duration,`Recording ${this.#name} (${resolution} @ ${fps}fps) for ${duration} seconds`)

                    if (elapsed >= duration) {
                        clearInterval(interval)
                    }

                },1000)

                exec(`ffmpeg -y -f avfoundation -framerate ${fps} -video_size ${resolution} -i "${this.#index}:none" -pixel_format ${pixelFormat} -vframes ${framesCount} ${output} -hide_banner &`, (error, stdout, stderr) => {})

            } else {
                reject('Mode not supported')
            }


        })

    }

    get index() { return this.#index }

    get name() { return this.#name }

    get type() { return this.#type }

    get modes() { return this.#modes }

}

/**
 * Display a progress bar in the console
 * @param {Number} current 
 * @param {Number} total 
 * @param {String} message 
 */
function displayProgressBar(current, total,message) {
    if(current > 0) console.log("\x1b[3A")
    const barSize = message.length + 6;
    const barPercent = Math.round(current / total * 100);
    const barCurrent = Math.round(barSize * current / total);
    console.log(`${'▓'.repeat(barCurrent)}${'░'.repeat(barSize - barCurrent)} ${barPercent}%`)
    console.log(' '.repeat(3) + message + ' '.repeat(3))
}