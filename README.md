<div align="center">

🏗️  This project is currently not on npm, let me time to create the repo and upload it  🏗️ 

⚠️ This project is still in beta, it's work only on OSX ⚠️
</div>

<div align="center">

# ffmpeg-node

![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Bash](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)

 A ffmpeg nodejs wrapper to access to ffmpeg withing your nodejs code

[Installation](#installation) • [Usage](#usage) • [License](#license)

</div>

# Installation

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

# License

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International](http://creativecommons.org/licenses/by-sa/4.0/)

[![by-sa](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)
