<div align="center">

# ffmpeg-panda

![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Bash](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)
![OSX](https://img.shields.io/badge/OSX-000000?style=for-the-badge&logo=apple&logoColor=white)

 A ffmpeg nodejs wrapper to access to ffmpeg withing your nodejs code

[Installation](#installation) • [Usage](#usage) • [License](#license)

</div>

> ⚠️ This project is still in beta, it works only on OSX, windows and linux version version comming soon ⚠️

# Installation

```bash
brew install ffmpeg
```

```bash
npm i ffmpeg-panda
```

# Usage

```javascript
import Ffmpeg from './ffmpeg.js'
```

List avaiable avfoundation devices

```javascript
// Get device list
let deviceList = await Ffmpeg.listDevices()

// Print device list
console.log(deviceList.map(d => "[" + d.index + "] " + d.name))
```
<img width="508" alt="image" src="https://github.com/quentinlamamy/ffmpeg-node/assets/6804887/112e55d0-527a-44cc-95b2-c91d4cd93b6a">

Show device informations and features
```javascript
// Get device list
let deviceList = await Ffmpeg.listDevices()
let device     = deviceList[0]

// Retrieve devices features
await device.detectFeatures()

// Print devices features
device.infos()
```
<img width="624" alt="image" src="https://github.com/quentinlamamy/ffmpeg-node/assets/6804887/53318c03-0983-43cb-85b5-d4e100f4370a">

Show devices modes
```javascript
// Get device list
let deviceList = await Ffmpeg.listDevices()
let device     = deviceList[0]

// Retrieve devices features
await device.detectFeatures()

// Print devices modes
device.listModes()
```

Show pixel format
```javascript
// Get device list
let deviceList = await Ffmpeg.listDevices()
let device     = deviceList[0]

// Retrieve devices features
await device.detectFeatures()

// Print devices pixel format
device.listModes()
```

Device.takePicture()

| Argument      | Type   | Description
|---------------|:------:|:----------------|
| resolution    | string | ex : 4032x3024  |
| fps           | string | ex : 5.000000   |
| pixel format  | string | ex : nv12       |
| output        | string | the file output |
    

> By default if no argument given, it will use the last mode of the list (usualy the higher resolution) and the first pixel format of the list. The output filename will be : output.jpg

> ❌ Will return a rejected promise if given parameters doesn't fit an avaiable mode

```javascript
// Get device list
let deviceList = await Ffmpeg.listDevices()
let device     = deviceList[0]

// Retrieve devices features
await device.detectFeatures()
let filename = await device.takePicture()
console.log("File created: " + filename)
```

# License

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International](http://creativecommons.org/licenses/by-sa/4.0/)

[![by-sa](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)
