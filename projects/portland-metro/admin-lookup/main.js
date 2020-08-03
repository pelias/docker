const _ = require('lodash')
const cpuCount = require('os').cpus().length
// const through = require('through2');
const transform = require('parallel-transform');
const parallelism = cpuCount
const logger = require('pelias-logger').get('admin-lookup');
const streamOptions = { highwaterMark: 2000, ordered: false  }

// network client
// const SpatialServiceConfig = require('./SpatialServiceConfig');
// const client = new SpatialServiceConfig().createClient()

// local client
const client = require('./localClient')

function create(adminLayers){
  // return through.obj(streamOptions, (doc, enc, next) => {
  return transform(parallelism, streamOptions, (doc, next) => {

    client({doc, adminLayers}, ({err, doc}) => {
      if (err) {
        console.error('PIP error', err)

        // if there's an error, just log it and move on
        logger.error(`PIP server failed: ${(err.message || JSON.stringify(err))}`, {
          id: doc.getGid(),
          lat: doc.getCentroid().lat,
          lon: doc.getCentroid().lon
        });

        // don't pass the unmodified doc along
        return next()
      }

      // console.error(query)
      next(null, doc);
    });
  })
}

module.exports = { create }
