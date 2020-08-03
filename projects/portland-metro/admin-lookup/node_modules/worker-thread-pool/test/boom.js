'use strict'

const { parentPort } = require('worker_threads')

parentPort.on('message', handleMessage)

function handleMessage (message) {
  throw new Error('boooom')
}
