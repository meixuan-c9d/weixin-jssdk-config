const debug = require('./configs/debug')
const crypto = require('crypto')
const promififyAsync = require('./utils/promisify-async')
const { promisify } = require('util')

module.exports = promififyAsync(async (request, response, next) => {
  const cryptoRandomBytes = promisify(crypto.randomBytes)
  const nonceString = (await cryptoRandomBytes(16)).toString('hex')
  const jsAPITicket = request.params.jsAPITicket
  const timestamp = Date.now() / 1000 | 0
  const url = request.query.url

  const config = {
    jsapi_ticket: jsAPITicket,
    noncestr: nonceString,
    timestamp,
    url
  }

  const arrayKeys = [
    'jsapi_ticket',
    'noncestr',
    'timestamp',
    'url'
  ].sort()
  const stringToHash = arrayKeys
    .map(key => `${key}=${config[key]}`)
    .join('&')

  const hash = crypto.createHash('sha1')
  hash.on('readable', () => {
    const data = hash.read()
    if (data) {
      const digest = data.toString('hex')

      const configOutput = ({
        signature: digest,
        nonceStr: nonceString,
        timestamp,
        appId: process.env.NODE_ENV === 'production'
          ? process.env.WEXIN_APP_ID
          : process.env.WEIXIN_APP_ID_DEV,
        jsAPIList: [
          'updateAppMessageShareData',
          'updateTimelineShareData'
        ]
      })

      debug.log(`
        configOutput
        %O
      `, configOutput)

      response.json(configOutput)
    }
  })
  hash.write(stringToHash)
  hash.end()

  /*
  hash.update(stringToHash)
  const digest = hash.digest('hex')

  const configOutput = ({
    signature: digest,
    nonceStr: nonceString,
    timestamp,
    appId: process.env.NODE_ENV === 'production'
      ? process.env.WEXIN_APP_ID
      : process.env.WEIXIN_APP_ID_DEV,
    jsAPIList: [
      'updateAppMessageShareData',
      'updateTimelineShareData'
    ]
  })

  debug.log(`
    configOutput
    %O
  `, configOutput)

  response.json(configOutput)
  
  return
  */
  
})