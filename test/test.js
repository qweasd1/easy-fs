/**
 * Created by tony on 7/13/17.
 */
'use strict'

const path = require('path');
const fs = require('fs');
const EasyFs = require('../lib/index');

let project = EasyFs.create({
  cwd:process.cwd()
})


project.on("child.addFile",(path)=>{
  console.log(path);
})

setTimeout(()=>{
  project.dir("src/test").bundle({
    "test.js":`module.exports = {
     
}`
  })
},1000)


