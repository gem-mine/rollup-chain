import ChainedMap from './lib/ChainedMap'
import Orderable from './lib/Orderable'

class Plugin extends ChainedMap {
  name: string

  type: string

  init!: (
    fn: (
      PluginConstructor: (...args: any) => any | Object,
      args: Object[]
    ) => any
  ) => void

  constructor(parent, name: string, type = 'plugin') {
    super(parent)
    this.name = name
    this.type = type
    this.extend(['init'])

    this.init((pluginExport, args = []) => {
      if (typeof pluginExport === 'function') {
        return pluginExport(...args)
      }
      return pluginExport
    })
  }

  use(plugin, args = []) {
    return this.set('plugin', plugin).set('args', args)
  }

  tap(f) {
    this.set('args', f(this.get('args') || []))
    return this
  }

  set(key, value) {
    if (key === 'args' && !Array.isArray(value)) {
      throw new Error('args must be an array of arguments')
    }
    return super.set(key, value)
  }

  merge(obj, omit: string[] = []) {
    if ('plugin' in obj) {
      this.set('plugin', obj.plugin)
    }

    if ('args' in obj) {
      this.set('args', obj.args)
    }

    return super.merge(obj, [...omit, 'args', 'plugin'])
  }

  toConfig() {
    const init = this.get('init')
    let plugin = this.get('plugin')
    const args = this.get('args')
    let pluginPath

    // Support using the path to a plugin rather than the plugin itself,
    // allowing expensive require()s to be skipped in cases where the plugin
    // or webpack configuration won't end up being used.
    if (typeof plugin === 'string') {
      pluginPath = plugin
      // eslint-disable-next-line global-require, import/no-dynamic-require
      plugin = require(pluginPath)
    }

    const constructorName = plugin.__expression
      ? `(${plugin.__expression})`
      : plugin.name

    const config = init(plugin, args)

    Object.defineProperties(config, {
      __pluginName: { value: this.name },
      __pluginType: { value: this.type },
      __pluginArgs: { value: args },
      __pluginConstructorName: { value: constructorName },
      __pluginPath: { value: pluginPath },
    })

    return config
  }
}

export default Orderable(Plugin)
