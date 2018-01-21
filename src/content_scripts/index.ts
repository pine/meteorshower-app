'use strict'

import { loadConfigFromBackground, Pattern } from '../config'

interface Repository {
  owner: string
  name: string
  gist: boolean
  forked: boolean
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

function getRepository(): Repository | null {
  const pattern = /^https:\/\/((?:gist\.)?)github\.com\/([^\/]+)\/([^\/]+)/
  const matches = pattern.exec(location.href)
  if (!matches) return null

  const gist = matches[1].length > 0
  const forked = !!document.querySelector('.fork-flag')
  return { owner: matches[2], name: matches[3], gist, forked }
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

  const repository = getRepository()
  if (!repository) return
  if (DEBUG) {
    console.log('A repository detected', repository)
  }

  // Fork
  if (config.excludeGist && repository.gist) {
    console.log('The repository is gist')
    return
  }

  // Gist
  if (config.excludeForked && repository.forked) {
    console.log('The repository has been forked')
    return
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
