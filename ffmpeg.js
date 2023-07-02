import { exec } from 'child_process'
import Path from 'path'

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
                        
                        if(match){

                            if(match.groups.name.includes('screen')){continue}

                            deviceList.push(new Device(match.groups.index,match.groups.name, currentCategory))
                        }

                    }
                    
                }

                resolve(deviceList)

            })

        })

    }

}
export default ffmpeg

// Create video 
// ffmpeg -f avfoundation -framerate 5 -pixel_format yuyv422 -i "0" out.avi -hide_banner

class Mode {

    #resolution
    #framerateMin
    #framerateMax

    constructor(resolution, framerate) {
        this.#resolution = resolution
        this.#framerateMin = framerate.min
        this.#framerateMax = framerate.max
    }

    get width() {return this.#resolution.split('x')[0]}

    get height() {return this.#resolution.split('x')[1]}

    get fpsMin() {return this.#framerateMin}

    get fpsMax() {return this.#framerateMax}

    get resolution() {return this.#resolution}

    get framerate() {return this.#framerateMin + " - " + this.#framerateMax}

    toString() {return this.#resolution + " @ " + this.#framerateMin + " - " + this.#framerateMax}

}

class Device {

    #index
    #name
    #type   
    #modes = []
    #pixelFormats = []

    constructor(index, name,type) {

        this.#index = index
        this.#name  = name
        this.#type  = type

    }

    /**
     * Detect available features for this devices. Features are stored in the #modes and #pixelFormats properties
     * @returns {Promise}
     */
    async detectFeatures(){

        if(this.#type == 'video'){
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

                            let mode = new Mode(m.groups.width + "x" + m.groups.height, {min:m.groups.min,max:m.groups.max})

                            this.#modes.push(mode)

                        }
                    }

                }

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

            exec(`ffmpeg -y -f avfoundation -framerate ${this.#modes[0].fpsMin} -video_size ${this.#modes[0].resolution} -i ${this.#index} -hide_banner`, (error, stdout, stderr) => {

                let lines = error.message.split('\n')

                for (let i = 0; i < lines.length; i++) {
   
                    const line = lines[i];
                    if(line.includes('Selected') || line.includes('Supported') || line.includes('Overriding')){continue}
                    
                    const match = line.matchAll(/\[avfoundation @ [a-z0-9]+\](?<pixelFormat>[ a-z0-9]+)/g);

                    if (match) {
                        for (const m of match) {

                            this.#pixelFormats.push(m.groups.pixelFormat.trim())

                        }
                    }
                }

                resolve()

            })

        })

    }

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

        for(let i = 0; i < this.#modes.length; i++){
            console.log("│   " + i.toString().padEnd("4"," ") + "│ " + this.#modes[i].resolution.padEnd("11"," ") + "│ " + this.#modes[i].framerate.padEnd("23"," ") + "│")
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

        for(let i = 0; i < this.#pixelFormats.length; i++){
            console.log("│    " + i.toString().padEnd("3"," ") + "│ " + this.#pixelFormats[i].padEnd("8"," ") + "│")
        }

        console.log("└───────┴─────────┘")

    }

    /**
     * Print informations about this device
     * @returns {void}
     */
    infos(){

        console.log("Name : " + this.#name)
        console.log("Type : " + this.#type)
        console.log("Index: " + this.#index)
        console.log("")

        this.listModes()
        this.listPixelFormats()

    }

    takePicture(resolution = this.#modes[this.#modes.length -1].resolution, fps = this.#modes[this.#modes.length -1].fpsMax, pixelFormat = this.#pixelFormats[0],output = "output.jpg") {

        return new Promise((resolve, reject) => {

            if(this.testMode(resolution.split('x')[0], resolution.split('x')[1], fps)){

                exec(`ffmpeg -y -f avfoundation -framerate ${fps} -video_size ${resolution} -i ${this.#index} -vframes 1 ${output} -pixel_format ${pixelFormat} -hide_banner`, (error, stdout, stderr) => {

                    resolve(Path.join(process.cwd(),output))
    
                })
            }else{
                reject('Mode not supported')
            }


        })

    }

    get index() {return this.#index}

    get name() {return this.#name}

    get type() {return this.#type}

    get modes() {return this.#modes}

}