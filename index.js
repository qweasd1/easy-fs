/**
 * Created by tony on 7/15/17.
 */
'use strict'

const path = require('path');

const FileWatcher = require('./lib/FileWatcher');
const Directory = require('./lib/Directory');

function create(options) {
  options.cwd = path.resolve(options.cwd)
  let root = new Directory(options)
  let whenWatcherReady = new Promise((resolve, reject) => {
    root.watcher.watcher.on("ready",()=>{
      resolve(root)
    })
    
    root.watcher.watcher.on("error",(err)=>{
      reject(err)
    })
  })
  root.whenWatcherReady = whenWatcherReady
  return root
}


module.exports = {
  create
}