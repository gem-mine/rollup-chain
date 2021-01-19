import * as jsStringify from 'javascript-stringify'
import ChainedMap from './lib/ChainedMap'
import Plugin from './Plugin'
import Output from './Output'
import Treeshake from './Treeshake'
import Watch from './Watch'

class Config extends ChainedMap {
  input: ChainedMap

  plugins: ChainedMap

  outputs: ChainedMap

  watch: Watch

  treeshake: Treeshake

  constructor() {
    super()
    this.input = new ChainedMap(this)
    this.plugins = new ChainedMap(this)
    this.outputs = new ChainedMap(this)
    this.watch = new Watch(this)
    this.treeshake = new Treeshake(this)

    this.extend([
      'external',
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
        input: this.input.entries(),
        treeshake: this.treeshake.entries(),
        watch: this.watch.entries(),
      }),
    )
  }

  static toString(config, { verbose = false, configPrefix = 'config' } = {}) {
    const { stringify } = jsStringify

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
            const args = _stringify(value.__pluginArgs)?.slice(1, -1)
            return `${prefix} ${constructorExpression}(${args})`
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

  uniqueArr(arr: any[]) {
    return Array.from(new Set(arr))
  }
}

export default Config
