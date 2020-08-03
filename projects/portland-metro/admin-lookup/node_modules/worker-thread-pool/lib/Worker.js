'use strict'

const { Worker, MessageChannel } = require('worker_threads')
const EventEmitter = require('events')
const AggregateError = require('aggregate-error')

const addNewWorkerToPool = Symbol('addNewWorkerToPool')
const onMessage = Symbol('onMessage')
const onRelease = Symbol('onRelease')
const pool = Symbol('pool')
const queue = Symbol('queue')
const run = Symbol('run')
const size = Symbol('size')
const closing = Symbol('closing')
const path = Symbol('path')

module.exports = class ThreadPool extends EventEmitter {
  constructor (options) {
    super()
    const opts = options
    this[path] = opts.path
    this[size] = opts.size || 4
    this[pool] = []
    this[queue] = []
    this[closing] = false
    for (let i = 0; i < this[size]; i++) {
      this[addNewWorkerToPool]()
    }
    this[onRelease] = this[onRelease].bind(this)
    this.on('release', this[onRelease])
  }

  run (workerData) {
    return new Promise((resolve, reject) => {
      if (this[pool].length > 0) {
        const worker = this[pool].shift()
        this[run](worker, workerData, resolve, reject)
      } else {
        this[queue].push((worker) => {
          this[run](worker, workerData, resolve, reject)
        })
      }
    })
  }

  close () {
    this[closing] = true
    const promises = []
    const size = this.poolLength()
    for (let index = 0; index < size; index++) {
      const worker = this[pool].shift()
      promises.push(new Promise((resolve) => {
        worker.terminate(resolve)
      }))
    }
    Promise.all(promises)
      .then(handleErrors)
      .then(() => this.emit('close'))
      .catch((error) => {
        this.emit('error', error)
        this.emit('close')
      })
  }

  queueLength () {
    return this[queue].length
  }

  poolLength () {
    return this[pool].length
  }

  [onRelease] (worker) {
    if (this[queue].length > 0) {
      const cb = this[queue].shift()
      cb(worker)
    } else {
      this[pool].push(worker)
    }
  }

  [run] (worker, workerData, resolve, reject) {
    let messageChannel = new MessageChannel()
    workerData.port = messageChannel.port1
    messageChannel.port2.once('message', (result) => {
      worker.removeAllListeners('error')
      this[onMessage](resolve, worker, result)
    })
    worker.once('error', (err) => {
      reject(err)
      this[addNewWorkerToPool]()
    })
    worker.postMessage(workerData, [messageChannel.port1])
  }

  [onMessage] (resolve, worker, result) {
    this.emit('release', worker)
    resolve(result)
  }

  [addNewWorkerToPool] () {
    const worker = new Worker(this[path])
    worker.once('exit', (exitCode) => {
      if (exitCode !== 0 && !this[closing]) {
        this[addNewWorkerToPool]()
      }
    })
    this[pool].push(worker)
  }
}

function handleErrors (maybeErrors) {
  const errors = maybeErrors.filter(notNull)
  if (errors.length === 0) {
    return
  }
  throw new AggregateError(errors)
}

function notNull (error) {
  return error != null
}
