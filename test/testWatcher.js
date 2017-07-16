/**
 * Created by tony on 7/15/17.
 */
'use strict'

const Directory = require('../lib/Directory');
const Watcher = require('../lib/FileWatcher');
const chokidar = require('chokidar');

let d = new Directory({
  absolutePath:__dirname
})


let watcher = new Watcher({
  cwd:__dirname,
  ignored:["node_modules/*/**/*"]
})



watcher.addListener("child.addFile",d.relativePath,null,(path)=>{
  console.log("child.addFile:" + path);
})

watcher.addListener("child.addDir",d.relativePath,null,(path)=>{
  console.log("child.addDir:" + path);
})

watcher.addListener("child.removeDir",d.relativePath,null,(path)=>{
  console.log("child.removeDir:" + path);
})

watcher.addListener("child.removeFile",d.relativePath,null,(path)=>{
  console.log("child.removeFile:" + path);
})

watcher.addListener("child.change",d.relativePath,null,(path)=>{
  console.log("child.change:" + path);
})

watcher.addListener("change",d.file("test1.js").relativePath,null,(path)=>{
  console.log("change:"+path);
})

watcher.addListener("remove",d.dir("aTest").relativePath,null,(path)=>{
  console.log("remove:" + path);
})

watcher.addListener("remove",d.dir("aa.js").relativePath,null,(path)=>{
  console.log("remove:" + path);
})





