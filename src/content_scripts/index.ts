'use strict'

import { FSC_LOAD_CONFIG } from '../event'

function checkStar() : boolean {
  const starred = document.querySelector('.starring-container .starred')
  const unstarred = document.querySelector('.starring-container .unstarred')
  if (!starred || !unstarred) return false

  const starredStyle = document.defaultView.getComputedStyle(starred, '')
  const isStarred = starredStyle.display !== 'none'

  if (!isStarred) {
    const starButton = unstarred.querySelector('button')
    if (starButton) {
      starButton.click()
      return true
    }
  }
  return false
}

function getRepository() : Repository | null {
  const pattern = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/
  const matches = pattern.exec(location.href)
  return matches ? { owner: matches[1], name: matches[2] } : null
}

async function loadConfig() : Promise<Configuration> {
  return new Promise<Configuration>((resolve, reject) => {
    chrome.runtime.sendMessage({ type: FSC_LOAD_CONFIG }, (response: any) => {
      resolve(response)
    })
  })
}

function findMatchedPattern(
  repository: Repository,
  patterns: ExcludedPattern[]
) : ExcludedPattern | null {
  for (const pattern of patterns) {
    if (pattern.owner === repository.owner) {
      if (!pattern.name || pattern.name === repository.name) {
        return pattern
      }
    }
  }
  return null
}

async function main() {
  if (DEBUG) {
    console.log('The content scripts started')
  }

  const config = await loadConfig()
  if (DEBUG) {
    console.log('The config loaded', config)
  }

  const repository = getRepository()
  if (!repository) return
  if (DEBUG) {
    console.log('A repository detected', repository)
  }

  const matchedPattern = findMatchedPattern(repository, config.exclude)
  if (matchedPattern) {
    console.log('The repository excluded by', matchedPattern)
    return
  }

  if (checkStar()) {
    console.log('The new star checked')
  } else {
    console.log('The repository has already checked')
  }
}

export = main()

// vim: se et ts=2 sw=2 sts=2 ft=typescript :
