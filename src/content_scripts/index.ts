'use strict'

import { loadConfigFromBackground, Pattern } from '../config'

interface Repository {
  owner: string
  name: string
}

function checkStar(): boolean {
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

function getRepository(excludeGist: boolean): Repository | null {
  const pattern = excludeGist ?
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/ :
    /^https:\/\/(?:gist\.)?github\.com\/([^\/]+)\/([^\/]+)/
  const matches = pattern.exec(location.href)
  return matches ? { owner: matches[1], name: matches[2] } : null
}

function findMatchedPattern(
  repository: Repository,
  patterns: Pattern.T[]
): Pattern.T | null {
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
    console.log('Content scripts started')
  }

  const config = await loadConfigFromBackground()
  if (DEBUG) {
    console.log('The config loaded', config)
  }

  const repository = getRepository(!!config.excludeGist)
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
