/**
 * Created by tony on 7/13/17.
 */
'use strict'

const Node = require('./Node');
const fs = require('fs');

class File extends Node {
  constructor(name, parent) {
    super(name ,parent)
    this.type = "file"
    let splitIndex = name.lastIndexOf(".")
    if (splitIndex != -1) {
      this.baseName = name.substring(0,splitIndex)
      this.ext = name.substring(splitIndex+1)
    }
    else{
      this.baseName = name
      this.ext = ""
    }
    
    this._isDirty = true
    this._createFileIfNotExists()
    
  }
  
  get content(){
    if (this._isDirty) {
      this._contentCache = fs.readFileSync(this.absolutePath).toString()
      this._isDirty = false
    }
    return this._contentCache
  }
  
  write(content){
    fs.writeFileSync(this.absolutePath,content)
  }

  
  remove(){
    if (this.name in this.parent._childrenCache) {
      delete this.parent._childrenCache[this.name]
    }
    fs.unlinkSync(this.absolutePath)
    this.isRemoved = true
  }
  

  
  // helper
  _createFileIfNotExists(){
    if (!fs.existsSync(this.absolutePath)) {
      fs.writeFileSync(this.absolutePath,"")
    }
  }
  
}

module.exports = File