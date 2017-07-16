/**
 * Created by tony on 7/15/17.
 */
'use strict'

const Directory = require('../lib/Directory');
const Watcher = require('../lib/FileWatcher');
const chokidar = require('chokidar');

let d = new Directory({
  cwd:__dirname
})


let f = d.file("src/test.js")
f.content

d.on("child.addFile",(path)=>{
  console.log("child.addFile:" + path);
})

d.on("child.addDir",(path)=>{
  console.log("child.addDir:" + path);
})

d.on("child.removeDir",(path)=>{
  console.log("child.removeDir:" + path);
})

d.on("child.removeFile",null,(path)=>{
  console.log("child.removeFile:" + path);
})

d.on("child.change",(path)=>{
  console.log("child.change:" + f.content);
})

d.file("test1.js").on("change",(path)=>{
  console.log("change:"+path);
})

d.file("test1.js").on("remove",(path)=>{
  console.log("remove:"+path);
})

d.dir("aTest").on("remove",(path)=>{
  console.log("remove:" + path);
})






