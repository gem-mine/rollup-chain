/* eslint-disable @typescript-eslint/indent */
import Config from '../../src/Config'

const config = new Config()

config.input.set('xxx', 'yyyy')

console.log(config.toConfig())
