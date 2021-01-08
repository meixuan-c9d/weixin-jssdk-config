const debug = require('./debug')
const redis = require('redis')
// const redisClient = redis.createClient('/tmp/redis.sock')
const redisClient = redis.createClient(process.env.REDIS_SOCKET_PATH)

redisClient.on('error', error => {
  throw new Error(`
    error redist client ${error}
  `)
})

redisClient.on('ready', () => {
  debug.log(`
    redis client ready
  `)
})

module.exports = redisClient