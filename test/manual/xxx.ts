/* eslint-disable @typescript-eslint/indent */
import Config from '../../src/Config'

const config = new Config()

config
  .input('xxxx')
    .add('test')
    .end()
  .input('xxxx2')
    .add('test2')
    .end()
  .input('xxxx3')
    .add('test2')

console.log(config.toConfig())
