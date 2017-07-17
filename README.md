# easy-fs

file system library to help you build scaffolding tools easily

## Install
```bash
//yarn
yarn add easy-fs

//npm
npm install easy-fs

```

## Quick Start
```javascript
const EasyFs =  require('easy-fs');
let project = EasyFs.create({
  cwd:process.cwd()
})


project.bundle({
  "src":{
    "app.js":"console.log('hello world!')",
    "READEME.md":"#Your Awesome Project"
  },
  "package.json":`{name:"hello-world",version:0.0.1}`
})

```

## API reference


## TODO
* add watcher ready function