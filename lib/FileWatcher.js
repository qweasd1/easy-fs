/**
 * Created by tony on 7/14/17.
 */
'use strict'

const anymatch = require('anymatch');
const path = require('path');
const chokidar = require('chokidar');

const childEventNames = ["child.addFile", "child.removeFile", "child.addDir", "child.removeDir", "child.change"]
const nodeEventNames = ["change", "remove"]


function alwaysTrue() {
  return true
}

function isSamePath(path1, path2) {
  if (path1 === path2 ||
    (path1.endsWith("/") && path1.length - path2.length == 1) ||
    (path2.endsWith("/") && path2.length - path1.length == 1 )
  ) {
    return true
  }
  else {
    return false
  }
}


function isChildPath(parent, child) {
  if (child.indexOf(parent) === 0) {
    return !isSamePath(parent, child)
  }
  else {
    return false
  }
}

function removeTailingSeperatorIfDirectory(filters, eventName){
  if (eventName === "child.addDir" || eventName === "child.removeDir") {
    return filters.map((filter)=>{
      if (typeof filter === "string" && filter.endsWith("/")) {
        return filter.substring(0,filter.length-1)
      }
      else {
        return filter
      }
    })
  }
  else {
    return filters
  }
}

function removePrefix(prefix, filepath) {
  if (prefix.length === 0) {
    return filepath
  }
  else {
    return filepath.substr(prefix.length + 1)
  }
}


function invokeNodeChildEventCallback(filepath, eventName) {
  let addChlidListeners = this.listeners[eventName]
  for (let prefix in addChlidListeners) {
    if (isChildPath(prefix, filepath)) {
      filepath = removePrefix(prefix, filepath)
      for (let {filter, callback} of addChlidListeners[prefix]) {
        if (filter(filepath)) {
          callback(filepath)
        }
      }
    }
  }
}

function invokeNodeEventCallback(filepath, eventName) {
  let addChlidListeners = this.listeners[eventName]
  for (let prefix in addChlidListeners) {
    if (isSamePath(prefix, filepath)) {
      filepath = removePrefix(prefix, filepath)
      for (let {callback} of addChlidListeners[prefix]) {
        callback(filepath)
      }
    }
  }
}


class Watcher {
  
  constructor(options,rootDirectory) {
    // root of the project
    this.root = path.resolve(options.cwd)
    this.rootDirectory = rootDirectory
    this.listeners = {}
    
    
    nodeEventNames.concat(childEventNames).forEach((eventName) => {
      this.listeners[eventName] = {}
    })
    
    // use copy of options since we need to change properties on options
    let _options = Object.assign({}, options)
    
    let paths
    if (_options.paths) {
      paths = _options.paths
      delete _options.paths
    }
    else {
      paths = ["."]
    }
    
    
    if (typeof _options.ignoreInitial === 'undefined') {
      _options.ignoreInitial = true
    }
    
    this.watcher = chokidar.watch(paths, _options)
    this._register()
  }
  
  /**
   * connect underlying watchers to listeners
   */
  _register() {
    // let relativeStartIndex = this.root.length + 1
    // let pathRelativeToRoot = (absolutePath) => {
    //   return absolutePath.substr(relativeStartIndex)
    // }
    
    let watcher = this.watcher
    // add
    watcher.on("add", (filepath) => {
      
      invokeNodeChildEventCallback.call(this, filepath, "child.addFile")
    })
    
    // addDir
    watcher.on("addDir", (filepath) => {
      invokeNodeChildEventCallback.call(this, filepath, "child.addDir")
    })
    
    // unlink
    watcher.on("unlink", (filepath) => {
      
      invokeNodeChildEventCallback.call(this, filepath, "child.removeFile")
      invokeNodeEventCallback.call(this, filepath, "remove")
    })
    
    // unlinkDir
    watcher.on("unlinkDir", (filepath) => {
      
      invokeNodeChildEventCallback.call(this, filepath, "child.removeDir")
      invokeNodeEventCallback.call(this, filepath, "remove")
    })
    
    
    watcher.on("change", (filepath) => {
      // on file change, we also need to update the file in model to mark it dirty
      this.rootDirectory.markFileDirty(filepath)
      invokeNodeChildEventCallback.call(this, filepath, "child.change")
      invokeNodeEventCallback.call(this, filepath, "change")
    })
  }
  
  /**
   *
   * @param prefix
   * @param filters
   * @param callback
   * @return {function()} dispose method to remove the listener
   */
  addListener(event, prefix, filters, callback) {
    let listeners = this.listeners[event]
    let prefixListenerList
    if (!(prefix in listeners)) {
      prefixListenerList = []
      listeners[prefix] = prefixListenerList
    }
    else {
      prefixListenerList = listeners[prefix]
    }
    
    let index = prefixListenerList.length
    let handler = {callback}
    if (~childEventNames.indexOf(event)) {
      let filter
      if (filters && filters.length > 0) {
        filter = anymatch(removeTailingSeperatorIfDirectory(filters,event))
      }
      else {
        filter = alwaysTrue
      }
      handler["filter"] = filter
    }
    
    prefixListenerList.push(handler)
    
    
    return () => {
      prefixListenerList[prefix].splice(index, 1)
    }
  }
}

module.exports = Watcher