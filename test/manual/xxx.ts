import Config from '../../src/Config'

const config = new Config()

config.entry
  .set('test', '/aas/dasd')

console.log(config.toConfig())
