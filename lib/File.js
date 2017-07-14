/**
 * Created by tony on 7/13/17.
 */
'use strict'

const Node = require('./Node');
const fs = require('fs');

class File extends Node {
  constructor(name, parent) {
    super(name, parent)
    this.$type = "file"
    let splitIndex = name.lastIndexOf(".")
    if (splitIndex != -1) {
      this.$baseName = name.substring(0,splitIndex)
      this.$ext = name.substring(splitIndex+1)
    }
    else{
      this.$baseName = name
      this.$ext = ""
    }
  }
  
  get content(){
    this.$initialize()
    if (this.$isDirty) {
      this.$content = fs.readFileSync(this.$absolutePath).toString()
      this.$isDirty = false
    }
    return this.$content
  }
  
  $initializeImpl(){
    // this check whether file changed but our memory File model is not changed accordingly
    this.$isDirty = true
  }
}

module.exports = File