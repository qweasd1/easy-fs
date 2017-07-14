/**
 * Created by tony on 7/13/17.
 */
'use strict'

let ORIGIN_TO_ACCESS_NAME_PATTERN = /[-.]/g

module.exports = {
  originNameToAccessName(originName){
    return originName.replace(ORIGIN_TO_ACCESS_NAME_PATTERN,"_").toLowerCase()
  }
}
