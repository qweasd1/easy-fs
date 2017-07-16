/**
 * Created by tony on 7/14/17.
 */
'use strict'

const path = require('path');

const chokidar = require('chokidar');
let watcher = chokidar.watch(["src","node_modules"],{
  ignoreInitial:true,
  cwd:process.cwd(),
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


