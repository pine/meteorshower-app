'use strict'

function putStar() {
  const starred = document.querySelector('.starring-container .starred')
  const unstarred = document.querySelector('.starring-container .unstarred')
  if (!starred || !unstarred) return

  const starredStyle = document.defaultView.getComputedStyle(starred, '')
  const isStarred = starredStyle.display !== 'none'

  if (!isStarred) {
    const starButton = unstarred.querySelector('button')
    starButton.click()
  }
}

function main() {
  if (DEBUG) {
    console.log('Start content scripts')
  }

  putStar()
}

export = main()

// vim: se et ts=2 sw=2 sts=2 ft=typescript :
