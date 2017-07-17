/**
 * Created by tony on 7/13/17.
 */
'use strict'

const Node = require('./Node');
const File = require('./File');
const Utils = require('./Utils');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path')
const glob = require('glob').sync;


class Directory extends Node {
  constructor(name, parent) {
    super(name, parent)
    this.type = "dir"
    // child files or directories, lazy load
    this._childrenCache = {}
  }
  
  
  dir(...paths) {
    return this._getOrCreateDir(this._cleanFilePath(paths))
  }
  
  file(...paths) {
    return this._getOrCreateFile(this._cleanFilePath(paths))
  }
  
  find(pattern) {
    let matches = glob(pattern, {
      cwd: this.absolutePath
    })
    
    if (matches.length === 0) {
      return null
    }
    else {
      return this._getNodeForPath(matches[0])
    }
  }
  
  findAll(pattern) {
    let matches = glob(pattern, {
      cwd: this.absolutePath
    })
    
    return matches.map(file => this._getNodeForPath(file))
  }
  
  remove(pattern){
    
    if(pattern){
     this.findAll(pattern).forEach((node)=>{
       node.remove()
     })
    }
    else {
      if (this.parent && this.name in this.parent._childrenCache) {
        delete this.parent._childrenCache[this.name]
      }
      fse.removeSync(this.absolutePath)
      this.isRemoved = true
    }
  }
  
  bundle(bundle) {
    for (let key in bundle) {
      let child = bundle[key]
      if (typeof child === 'object') {
        // TODO: currently, we just use direct pipe without wait for the pipe finished which is not good
        if (child instanceof fs.ReadStream) {
          child.pipe(fs.createWriteStream(this._getOrCreateFile([key]).absolutePath))
        }
        else {
          this._getOrCreateDir([key]).bundle(child)
        }
      }
      else if (typeof child === 'string') {
        this._getOrCreateFile([key]).write(child)
      }
    }
  }
  
  
  markFileDirty(path){
    let paths = path.split("/")
    let node = this
    for(let p of paths){
      if (p in node._childrenCache) {
        node = node._childrenCache[p]
      }
      else {
        return
      }
    }
    
    node._isDirty = true
  }

  
  _getOrCreateDir(paths) {
    
    if (paths.length == 0) {
      return this
    }
    
    // create directory
    let dirName = paths.shift()
    let absoluteDirPath = path.join(this.absolutePath, dirName)
    if (!fs.existsSync(absoluteDirPath)) {
      fs.mkdirSync(absoluteDirPath)
    }
    
    let dir
    
    if (dirName in this._childrenCache) {
      dir = this._childrenCache[dirName]
    }
    else {
      dir = new Directory(dirName, this);
      this._childrenCache[dirName] =  dir
    }
    if (paths.length > 0) {
      return dir._getOrCreateDir(paths)
    }
    else {
      return dir
    }
  }
  
  _getOrCreateFile(paths) {
    let absoluteNewFilePath = path.join(this.absolutePath, ...paths)
    
    let fileName = paths.pop()
    let lastDir = this._getOrCreateDir(paths)
    let file
    if (fileName in lastDir._childrenCache) {
      file = lastDir._childrenCache[fileName]
    }
    else {
      file = new File(fileName, lastDir)
      lastDir._childrenCache[fileName] = file
    }
    return file
  }
  
  
  _getNodeForPath(nodepath) {
    let paths = nodepath.split("/")
    if (paths[paths.length - 1] === "") {
      paths.pop()
    }
    if (fs.lstatSync(path.join(this.absolutePath, nodepath)).isDirectory()) {
      return this._getOrCreateDir(paths)
    }
    else {
      return this._getOrCreateFile(paths)
    }
  }
  
  _cleanFilePath(paths){
    let _paths = path.join(...paths).split("/")
    if (_paths[_paths.length - 1] === "") {
      _paths.pop()
    }
    return _paths
  }
}

module.exports = Directory