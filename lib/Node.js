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
      this.$parent = parent
      // absolute file path
      this.$absolutePath = path.join(parent.$absolutePath,name)
    }
    else {
      let config = name
      this.$parent = null
      this.$absolutePath = config.absolutePath
      name = path.basename(config.absolutePath)
    }
    
    // original filename
    this.$name = name
    this.$isInit = false
      
      
    
   
    
  }
  
  $initialize(){
    if (!this.$isInit) {
      this.$initializeImpl()
      this.$isInit = true
    }
  }
  
  $initializeImpl(){
    throw new Error("should be implemented in child class")
  }
}

module.exports = Node