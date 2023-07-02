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

Install ffmpeg
```bash
brew install ffmpeg
```
Install the package
```javascript
npm i ffmpeg-node
```

# Usage

```javascript
import Ffmpeg from './ffmpeg.js'
```

List avaiable avfoundation devices

```javascript
let deviceList = await Ffmpeg.listDevices()
console.log(deviceList.map(d => "[" + d.index + "] " + d.name))
```

# License

This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

[![by-nc-sa](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)
