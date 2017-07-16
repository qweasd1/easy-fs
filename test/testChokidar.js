/**
 * Created by tony on 7/14/17.
 */
'use strict'

const path = require('path');

const chokidar = require('chokidar');
let watcher = chokidar.watch(["."],{
  ignoreInitial:true,
  cwd:process.cwd() + "/" + "aTest",
  ignored:["node_modules/*/**/*"]
})

watcher.on("addDir", function (filename) {
  console.log(`addDir: ${filename}`);
})


watcher.on("add",(filename)=>{
  console.log(`add: ${filename}`);
})

watcher.on("unlink",(filename)=>{
  console.log(`delete: ${filename}`);
})


