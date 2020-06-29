import ChainedMap from './lib/ChainedMap'
import ChainedSet from './lib/ChainedSet'

import Plugin from './Plugin'
import Output from './Output'
import Treeshake from './Treeshake'
import Watch from './Watch'

class Config extends ChainedMap {
  entry: ChainedMap

  plugins: ChainedMap

  outputs: ChainedMap

  watch: Watch

  treeshake: Treeshake

  constructor() {
    super(undefined)
    this.entry = new ChainedMap(this)
    this.plugins = new ChainedMap(this)
    this.outputs = new ChainedMap(this)
    this.watch = new Watch(this)
    this.treeshake = new Treeshake(this)

    this.extend([
      'externals',
      'cache',
      'onwarn',
      'acorn',
      'acornInjectPlugins',
      'context',
      'moduleContext',
      'preserveSymlinks',
      'shimMissingExports',
      'experimentalCacheExpiry',
      'perf',
    ])
  }

  plugin(name: string) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name))
  }

  output(name: string) {
    return this.outputs.getOrCompute(name, () => new Output(this, name))
  }

  toConfig() {
    const outputs = this.outputs.entries() || {}

    return this.clean(
      Object.assign(this.entries() || {}, {
        plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
        output: Object.keys(outputs)
          .reduce(
            (acc, key) => {
              acc.push(outputs[key].toConfig())
              return acc
            },
            [] as object[],
          ),
        input: this.entry.entries() || {},
        treeshake: this.treeshake.entries(),
        watch: this.watch.entries(),
      }),
    )
  }

  static toString(config, { verbose = false, configPrefix = 'config' } = {}) {
    // eslint-disable-next-line global-require
    const { stringify } = require('javascript-stringify')

    return stringify(
      config,
      (value, indent, _stringify) => {
        // improve plugin output
        if (value?.__pluginName) {
          const prefix = `/* ${configPrefix}.${value.__pluginType}('${value.__pluginName}') */\n`
          const constructorExpression = value.__pluginPath
            ? `(require(${_stringify(value.__pluginPath)}))`
            : value.__pluginConstructorName

          if (constructorExpression) {
            // get correct indentation for args by stringifying the args array and
            // discarding the square brackets.
            const args = _stringify(value.__pluginArgs).slice(1, -1)
            return `${prefix}new ${constructorExpression}(${args})`
          }
          return (
            prefix
            + _stringify(
              value.__pluginArgs && value.__pluginArgs.length
                ? { args: value.__pluginArgs }
                : {},
            )
          )
        }

        // shorten long functions
        if (typeof value === 'function') {
          if (!verbose && value.toString().length > 100) {
            return 'function () { /* omitted long function */ }'
          }
        }

        return _stringify(value)
      },
      2,
    )
  }

  toString(options?: any) {
    return Config.toString(this.toConfig(), options)
  }
}

export default Config
