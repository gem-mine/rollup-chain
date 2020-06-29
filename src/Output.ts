import ChainedMap from './lib/ChainedMap'

import Plugin from './Plugin'

class Output extends ChainedMap {
  name: string

  plugins: ChainedMap

  constructor(parent, name: string) {
    super(parent)
    this.name = name
    this.plugins = new ChainedMap(this)

    this.extend([
      'dir',
      'file',
      'format',
      'globals',
      'name',
      'assetFileNames',
      'banner',
      'footer',
      'chunkFileNames',
      'compact',
      'entryFileNames',
      'extend',
      'hoistTransitiveImports',
      'inlineDynamicImports',
      'interop',
      'intro',
      'outro',
      'manualChunks',
      'minifyInternalExports',
      'paths',
      'preserveModules',
      'sourcemap',
      'sourcemapExcludeSources',
      'sourcemapFile',
      'sourcemapPathTransform',
      'amd',
      'esModule',
      'exports',
      'externalLiveBindings',
      'freeze',
      'indent',
      'namespaceToStringTag',
      'noConflict',
      'preferConst',
      'strict',
      'systemNullSetters'
    ])
  }

  plugin(name: string) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name))
  }

  toConfig() {
    const config = this.entries() || {}
    Object.assign(config, {
      plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
    })
    Object.defineProperties(config, {
      __outputName: { value: this.name }
    })
    return this.clean(config)
  }
}

export default Output
