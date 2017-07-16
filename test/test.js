/**
 * Created by tony on 7/13/17.
 */
'use strict'

const path = require('path');
const fs = require('fs');


const Directory = require('../lib/Directory');

let d = new Directory({
  absolutePath:path.resolve(process.cwd())
})

// let d = new Directory({
//   absolutePath:"/Users/tony/Documents/projects/web/keystone/try/keystone-e1"
// })

// d.dir("a","b","c","d")
// d.file("a","b","d","e.js")
// d.dir("src","app")

let f = d.dir("src/app/components")
f.newBundle({
  "new-component":{
    "a.css": fs.createReadStream("test.js"),
    "a.js":"test js",
    "a.spec.js":"test test js",
    "dir":{}
  }
})

// f.remove("*.js")
// console.log();

// let files = d.findAll("**/test.js")
// files.write("")


console.log();