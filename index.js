/**
 * Created by tony on 7/15/17.
 */
'use strict'

const path = require('path');

const FileWatcher = require('./lib/FileWatcher');
const Directory = require('./lib/Directory');

function create(options) {
  options.cwd = path.resolve(options.cwd)
  let root = new Directory(options)
  return root
}


module.exports = {
  create
}