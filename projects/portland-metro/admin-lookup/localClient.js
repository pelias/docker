const _ = require('lodash')
const codec = require('./codec')
const cpuCount = require('os').cpus().length
const Pool = require('worker-thread-pool');

// // const threads = require('worker_threads')
// const worker = new threads.Worker('./node_modules/pelias-wof-admin-lookup/queryServiceWorkerThread.js', {
//   workerData: {
//     readonly: true,
//     filename: '/data/spatial/docker.spatial.db'
//   }
// });


const pool = new Pool({
  size: cpuCount,
  path: './node_modules/pelias-wof-admin-lookup/queryServiceWorkerThread.js'
})

function lookup(message, cb){
  // console.error('lookup', query)
  message.doc = codec.marshal(message.doc)

  pool.run(message)
    .then(({ err, doc }) => {
      doc = codec.unmarshal(doc)
      cb({ err, doc })
    })
    .catch(({ err }) => {
      // console.error(message)
      cb({ err })
    })
}

module.exports = lookup
