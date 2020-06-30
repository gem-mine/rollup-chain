# rollup-chain

类似webpackChain, 支持v2.18.1

# Demo

```js
const RollupChainConfig = require('@gem-mine/rollup-chain')
const config = new RollupChainConfig()

config.input('index')
  .add('index', '/x.js')

config
  .output(currentTarget)
    .dir(api.resolve(options.outputDir))
    .entryFileNames(outputFilename)
    .chunkFileNames(outputFilename)
    .format(currentTarget)
    .sourcemap(needSourceMap)

config.plugin('node-resolve')
  .use(nodeResolve, [{
    rootDir: api.resolve('./'),
    preferBuiltins: !options.browser,
    browser: options.browser
  }])
```
