/**
 * Created by tony on 7/13/17.
 */
'use strict'

const path = require('path');
const FileWatcher = require('./FileWatcher');

/**
 * Node is the abstract Node for both File and Directory which holds the shared properties
 */
class Node {
  constructor(name, parent){
    // if the parent is not null, it's not the root Node, so use parent to calculate properties like absolutePath
    if (parent) {
      // parent node
      this.parent = parent
      // absolute file path
      this.absolutePath = path.join(parent.absolutePath,name)
      this.relativePath = path.join(parent.relativePath,name)
      this.watcher = parent.watcher
    }
    else {
      let options = name
      this.watcher = new FileWatcher(options,this)
      this.parent = null
      this.absolutePath = options.cwd
      this.relativePath = ""
      name = path.basename(options.cwd)
      
    }
    
    // original filename
    this.name = name
    this.isRemoved = false
    
  }
  
  on(event,filters,callback){
    if (typeof callback === "undefined") {
      callback = filters
      filters = null
    }
    else {
      if (!Array.isArray(filters)) {
        if (filters) {
          filters = [filters]
        }
      }
    }
    this.watcher.addListener(event,this.relativePath,filters,callback)
  }
}

module.exports = Node