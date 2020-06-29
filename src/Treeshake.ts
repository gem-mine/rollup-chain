import ChainedMap from './lib/ChainedMap'

class Watch extends ChainedMap {
  annotations!: (value: any) => void

  moduleSideEffects!: (value: any) => void

  propertyReadSideEffects!: (value: any) => void

  tryCatchDeoptimization!: (value: any) => void

  unknownGlobalSideEffects!: (value: any) => void

  constructor(parent) {
    super(parent)
    this.extend([
      'annotations',
      'moduleSideEffects',
      'propertyReadSideEffects',
      'tryCatchDeoptimization',
      'unknownGlobalSideEffects '
    ])
  }
}

export default Watch
