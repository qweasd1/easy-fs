/**
 * Created by tony on 7/13/17.
 */
'use strict'

const path = require('path');

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
    }
    else {
      let config = name
      this.parent = null
      this.absolutePath = config.absolutePath
      this.relativePath = ""
      name = path.basename(config.absolutePath)
    }
    
    // original filename
    this.name = name
    this.isRemoved = false
  }
}

module.exports = Node