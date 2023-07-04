<div align="center">

# ffmpeg-panda

![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Bash](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)
![OSX](https://img.shields.io/badge/OSX-000000?style=for-the-badge&logo=apple&logoColor=white)

 A ffmpeg nodejs wrapper to access to ffmpeg withing your nodejs code

[Installation](#installation) • [Usage](#usage) • [License](#license) . [Changelog](#changelog) . [Changelog](#changelog) . [Contributing](#contributing) . [Support](#support)

</div>

> ⚠️ This project is still in beta, it works only on OSX, windows and linux version comming soon.
Due to beta status, breaking change will appear, check the changelog and the documentation. A stable version will be release in next weeks for the 1.5 ⚠️
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

## Ffmpeg.listDevices()
List avaiable devices

> ℹ️ Because of some usage issue , screen device are hidden. They will be available in future version

```javascript
// Get device list
let deviceList = await Ffmpeg.listDevices()

// Print device list
console.log(deviceList.map(d => "[" + d.index + "] " + d.name))
```
<img width="508" alt="image" src="https://github.com/quentinlamamy/ffmpeg-node/assets/6804887/112e55d0-527a-44cc-95b2-c91d4cd93b6a">

## Device.infos()
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

## Device.listModes()
Show devices modes, mods are sorted by width
```javascript
// Get device list
let deviceList = await Ffmpeg.listDevices()
let device     = deviceList[0]

// Retrieve devices features
await device.detectFeatures()

// Print devices modes
device.listModes()
```
## Device.listPixelFormats()
Show pixel format
```javascript
// Get device list
let deviceList = await Ffmpeg.listDevices()
let device     = deviceList[0]

// Retrieve devices features
await device.detectFeatures()

// Print devices pixel format
device.listPixelFormats()
```

## Device.takePicture()
Take a picture with the device

| Argument      | Type   | Description
|---------------|:------:|:-----------------|
| output        | string | the file output  |
| resolution    | string | the resolution   |
| pixel format  | string | the pixel format |
    

> By default if no argument given, it will use the last mode of the list (the one width max width) and the first pixel format of the list. The output filename will be : output.jpg

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

## Device.takeVideo()
Take a video with the device

| Argument      | Type   | Description
|---------------|:------:|:-----------------------------|
| output        | string | the file output              |
| duration      | number | the video duration in second |
| resolution    | string | the resolution               |
| fps           | string | the framerate                |
| pixel format  | string | the pixel format             |

<img src="https://github.com/quentinlamamy/ffmpeg-panda/assets/6804887/01772124-4f77-4885-a5dc-0e0473c81f5d" width="700"/>

# License

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International](http://creativecommons.org/licenses/by-sa/4.0/)

[![by-sa](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)

# Changelog

1.1.0 : 
* 💥Breaking change💥 parameter order for taking picture of video change, output file become the first one (see documentation)
* 💥Breaking change💥 remove fps param for for taking picture
* Adding takeVideo method
* Adding more comment

# Roadmap

* Make future change non breaking
* Make sound record avaiable

# Contributing
A bug ? An idea of feature ? [Fill an issue on github](https://github.com/quentinlamamy/ffmpeg-panda/issues)

# Support
<a href="https://www.buymeacoffee.com/quentinlamamy" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
