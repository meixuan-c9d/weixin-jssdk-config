const debug = require('debug')

const error = debug('debug:error')

const log = debug('debug:log')
log.log = console.log.bind(console)

module.exports = {
  error,
  log
}