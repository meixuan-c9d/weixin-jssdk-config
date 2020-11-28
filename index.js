require('dotenv').config()
const debug = require('./configs/debug')
const express = require('express')
const app = express()

const getJSSDKConfig = require('./get-jssdk-config')

app
  .route('/:jsAPITicket')
  .get(getJSSDKConfig)
  
app.listen(process.env.LISTEN_PORT, () => {
  debug.log(`js-sdk config service running at ${process.env.LISTEN_PORT}`)
})