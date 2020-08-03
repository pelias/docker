const _ = require('lodash')
const cpuCount = require('os').cpus().length
const Pool = require('worker-thread-pool');

const threads = require('worker_threads')
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

function lookup(query, cb){

  // console.error('lookup', query)

  pool.run({ query })
    .then((result) => {
      cb(null, result)
    })
    .catch((err) => {
      cb(err)
    })
}

module.exports = lookup
