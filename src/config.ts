import {
  FSC_LOAD_CONFIG,
  FSC_SAVE_CONFIG,
} from './event'

export module Configuration {
  export declare interface T {
    exclude: Pattern.T[]
  }

  export function empty(): T {
    return {
      exclude: [],
    }
  }
}

export module Pattern {
  export declare type T = {
    owner: string
    name: string
  }

  export function empty(): T {
    return {
      owner: '',
      name: '',
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
