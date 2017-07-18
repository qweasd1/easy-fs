/**
 * Created by tony on 7/13/17.
 */
'use strict'

const path = require('path');
const fs = require('fs');
const EasyFs = require('../index');

let project = EasyFs.create({
  cwd:process.cwd()
})

project.on("child.addFile",(path)=>{
  console.log(path);
})


project.whenWatcherReady.then(()=>{
  project.file("a/b/c.js").write("test")
})


