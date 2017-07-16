/**
 * Created by tony on 7/14/17.
 */
'use strict'

const anymatch = require('anymatch');
const path = require('path');

const childEventNames = ["child.addFile", "child.removeFile","child.addDir","child.removeDir","child.change"]
const nodeEventNames = ["change", "remove"]


function alwaysTrue() {
  return true
}

function isSamePath(path1, path2) {
  if (path1 === path2 ||
    (path1.endsWith("/") && path1.length - path2.length ==1) ||
    (path2.endsWith("/") &&  path2.length - path1.length ==1 )
  ) {
    return true
  }
  else {
    return false
  }
}


function isChildPath(parent, child) {
  if (child.indexOf(parent) === 0) {
    return !isSamePath(parent,child)
  }
  else {
    return false
  }
}

function removePrefix(prefix, filepath) {
  if (prefix.length === 0) {
    return filepath
  }
  else {
    return filepath.substr(prefix.length+1)
  }
}


function invokeNodeChildEventCallback(filepath, eventName) {
  let addChlidListeners = this.listeners[eventName]
  for (let prefix in addChlidListeners) {
    if (isChildPath(prefix,filepath)) {
      filepath = removePrefix(prefix,filepath)
      for (let {filter,callback} of addChlidListeners[prefix]) {
        if (filter(filepath)) {
          callback(filepath )
        }
      }
    }
  }
}

function invokeNodeEventCallback(filepath, eventName) {
  let addChlidListeners = this.listeners[eventName]
  for (let prefix in addChlidListeners) {
    if (isSamePath(prefix,filepath)) {
      filepath = removePrefix(prefix,filepath)
      for (let {callback} of addChlidListeners[prefix]) {
        callback(filepath )
      }
    }
  }
}





class Watcher {
  
  constructor({
    root
  }) {
    // root of the project
    this.root = path.resolve(root)
    this.listeners = {}
  
  
    nodeEventNames.concat(childEventNames).forEach((eventName) => {
      this.listeners[eventName] = {}
    })
    
    
    this.watchers = []
    
  }
  
  /**
   * connect underlying watchers to listeners
   */
  register(){
    let relativeStartIndex = this.root.length + 1
    let pathRelativeToRoot = (absolutePath) => {
      return absolutePath.substr(relativeStartIndex)
    }
    
    for (let watcher of this.watchers) {
  
      // add
      watcher.on("add",(filepath)=>{
        
        invokeNodeChildEventCallback.call(this,pathRelativeToRoot(filepath),"child.addFile")
      })
      
      // addDir
      watcher.on("addDir",(filepath)=>{
        invokeNodeChildEventCallback.call(this,pathRelativeToRoot(filepath),"child.addDir")
      })
  
      // unlink
      watcher.on("unlink",(filepath)=>{
        filepath = pathRelativeToRoot(filepath)
        invokeNodeChildEventCallback.call(this,filepath,"child.removeFile")
        invokeNodeEventCallback.call(this,filepath,"remove")
      })
      
      // unlinkDir
      watcher.on("unlinkDir",(filepath)=>{
        filepath = pathRelativeToRoot(filepath)
        invokeNodeChildEventCallback.call(this,filepath,"child.removeDir")
        invokeNodeEventCallback.call(this,filepath,"remove")
      })
      
      
      watcher.on("change",(filepath)=>{
        filepath = pathRelativeToRoot(filepath)
        invokeNodeChildEventCallback.call(this,filepath,"child.change")
        invokeNodeEventCallback.call(this,filepath,"change")
      })
      
    }
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
        filter = anymatch(filters)
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