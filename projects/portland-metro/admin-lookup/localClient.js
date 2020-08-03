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

function lookup(doc, cb){
  // console.error('lookup', query)
  // message.doc = codec.marshal(message.doc)

  // const crypto = require('crypto')
  // const token = crypto.randomBytes(64).toString('hex').substr(0, 8);

  pool.run({ centroid: doc.getCentroid() })
    .then((message) => {
      // doc = codec.unmarshal(doc)
      // console.error('worker message', message)

      message.addParent.forEach(ap => {
        // console.error('addParent', ap)
        doc.addParent(...ap)
      })

      cb()
    })
    .catch(({ err }) => {
      // console.error(message)
      cb({ err })
    })
}

module.exports = lookup
