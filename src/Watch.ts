import ChainedMap from './lib/ChainedMap'

class Watch extends ChainedMap {
  // how to define class type from keyArray?
  buildDelay!: (value: any) => void

  chokidar!: (value: any) => void

  clearScreen!: (value: any) => void

  exclude!: (value: any) => void

  include!: (value: any) => void

  skipWrite!: (value: any) => void

  constructor(parent) {
    super(parent)
    this.extend([
      'buildDelay',
      'chokidar',
      'clearScreen',
      'exclude',
      'include',
      'skipWrite'
    ])
  }
}

export default Watch
