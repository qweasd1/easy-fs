/**
 * Created by tony on 7/13/17.
 */
'use strict'

const path = require('path');

const Directory = require('../lib/Directory');

let d = new Directory({
  absolutePath:path.resolve(process.cwd())
})

// let d = new Directory({
//   absolutePath:"/Users/tony/Documents/projects/web/keystone/try/keystone-e1"
// })

d.$newFile("a","b","c","d","e.js")


let files = d.findAll("**/test.js")
files.write("")


console.log();