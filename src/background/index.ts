'use strict'

import { FSC_LOAD_CONFIG } from '../event'

function main() {
  if (DEBUG) {
    console.log('Background scripts started')
  }

  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (DEBUG) {
        console.log(request)
      }
      switch (request.type) {
        case FSC_LOAD_CONFIG:
          // XXX
          sendResponse({
            exclude: [
              { owner: 'pine' },
            ],
          })
          return false
      }
    },
  )
}

export = main()

// vim: se et ts=2 sw=2 sts=2 ft=typescript :
