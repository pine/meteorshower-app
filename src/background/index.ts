'use strict'

import { Configuration } from '../config'

import {
  FSC_LOAD_CONFIG,
  FSC_SAVE_CONFIG,
} from '../event'

function loadConfig(
  sendResponse: (response: any) => void
): boolean {
  chrome.storage.sync.get('config', items => {
    const config = items.config || Configuration.empty()
    sendResponse(config)
  })
  return true
}

function saveConfig(
  config: Configuration.T,
  sendResponse: (response: any) => void
): boolean {
  chrome.storage.sync.set({ config }, () => sendResponse(null))
  return true
}

function main() {
  if (DEBUG) {
    console.log('Background scripts started')
  }

  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (DEBUG) {
        console.log(request.type, request.args)
      }
      switch (request.type) {
        case FSC_LOAD_CONFIG:
          return loadConfig(sendResponse)
        case FSC_SAVE_CONFIG:
          return saveConfig(request.args[0], sendResponse)
      }
    }
  )
}

export = main()
