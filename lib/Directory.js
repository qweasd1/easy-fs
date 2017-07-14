/**
 * Created by tony on 7/13/17.
 */
'use strict'

const Node = require('./Node');
const File = require('./File');
const Utils = require('./Utils');
const fs = require('fs');
const path = require('path')





class Directory extends Node {
  constructor(name,parent){
    super(name,parent)
    this.$type = "dir"
    // child files or directories, lazy load
    this.$children = null
  }
  
  $initializeImpl(){
    this.$children = {}
    let directories = fs.readdirSync(this.$absolutePath)
    directories.forEach((name)=>{
      let child
      if (fs.lstatSync(path.join(this.$absolutePath, name)).isDirectory()) {
        child = new Directory(name,this)
      }
      else {
        child = new File(name,this)
      }
      
      
      this.$_addChild(name,child)
      
    })
  }
  
  $_addChild(name, child){
    this.$children[name] = child
  
    let easyAccessName = Utils.originNameToAccessName(name)
    // if easy access name is already on current Directory, we just skip it, pls reference it from $children[originName]
    if (!this[easyAccessName]) {
      Object.defineProperty(this,Utils.originNameToAccessName(name),{
        get:()=>{
          child.$initialize()
          return child
        }
      })
    }
  
  }
  
  $newFile(...paths){
  
    // TODO: check if it's necessary to initialize the current Directory
    this.$initialize()
    
    if (paths.length > 1) {
      // create directory
      let dirName = paths.shift()
      let absoluteDirPath = path.join(this.$absolutePath,dirName)
      if (!fs.existsSync(absoluteDirPath)) {
        fs.mkdirSync(absoluteDirPath)
      }
      
      let newDirectory = new Directory(dirName,this);
      this.$_addChild(dirName,newDirectory)
      return newDirectory.$newFile(...paths)
    }
    else {
      let fileName = paths[0]
      let newFile = new File(fileName,this)
      this.$_addChild(fileName,newFile)
      // TODO: check if we need to write an empty file at this step all pend it for later
      return newFile
    }
  }
}

module.exports = Directory