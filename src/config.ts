import {
  FSC_LOAD_CONFIG,
  FSC_SAVE_CONFIG,
} from './event'

export namespace Configuration {
  export declare interface T {
    exclude: Pattern.T[]
    excludeForked?: boolean
    excludeGist?: boolean
  }

  export function empty(): T {
    return {
      exclude: [],
      excludeForked: false,
      excludeGist: false,
    }
  }
}

export namespace Pattern {
  export declare interface T {
    name: string
    owner: string
  }

  export function empty(): T {
    return {
      name: '',
      owner: '',
    }
  }
}

export async function loadConfigFromBackground(): Promise<Configuration.T> {
  return new Promise<Configuration.T>((resolve, reject) => {
    chrome.runtime.sendMessage({ type: FSC_LOAD_CONFIG }, (response: any) => {
      resolve(response)
    })
  })
}

export async function saveConfigForBackground(config: Configuration.T): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    chrome.runtime.sendMessage({ type: FSC_SAVE_CONFIG, args: [config] }, (response: any) => {
      resolve()
    })
  })
}
