const _ = require('lodash');
const through = require('through2');
// const transform = require('parallel-transform');
// const parallelism = 16
const logger = require('pelias-logger').get('admin-lookup');
const streamOptions = { highwaterMark: 200, ordered: false  }

// network client
// const SpatialServiceConfig = require('./SpatialServiceConfig');
// const client = new SpatialServiceConfig().createClient()

// local client
const client = require('./localClient')

function create(adminLayers){
  return through.obj(streamOptions, (doc, enc, next) => {
  // return transform(parallelism, streamOptions, (doc, next) => {

    const centroid = doc.getCentroid()
    const query = {
      lon: centroid.lon,
      lat: centroid.lat,
      lang: 'und',
      tag: 'default'
    }

    client(query, (err, res) => {
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
      mapPIPResultsToDocument(doc, res, { adminLayers });
      next(null, doc);
    });
  })
}

function mapPIPResultsToDocument(doc, res, config){
  const hits = _.get(res, 'hits', [])
  const place = _.get(res, 'place', {})
  const name = _.get(res, 'name', {})
  let hierarchy = _.get(res, 'hierarchy', {})

  // hard-core the WOF hierarchy branch to use
  const branch = 'wof:0'
  hierarchy = _.get(hierarchy, branch, {})

  // iterate over layers from most granular to least granular
  for (const layer of _.get(config, 'adminLayers', [])) {

    let parentIdentity = _.find(hits, (identity) => {
      const p = _.get(place, identity)
      return _.get(p, 'class') === 'admin' && _.get(p, 'type') === layer
    })

    // no match found at this layer
    if (!parentIdentity){ continue }

    // walk hierarchy to add parents
    const seen = {}
    while (parentIdentity){

      // prevent infinite recursion
      if (_.has(seen, parentIdentity)){ break }
      _.set(seen, parentIdentity);

      // load parent data
      const parent = {
        place: _.get(place, parentIdentity),
        name: _.get(_.get(name, parentIdentity), 'und|default')
      }

      // parent not found (not loaded into the spatial DB?)
      if( !_.has(parent, 'place.id') ){
        // logger.warn(`parent not found: ${parentIdentity}`);
        break
      }

      // assign parent properties to doc
      try {
        doc.addParent(
          _.get(parent, 'place.type'),
          _.get(parent, 'name.name[0]'),
          _.get(parent, 'place.id'),
          _.get(parent, 'name.abbr[0]')
        )
      }
      catch (err) {
        logger.warn('invalid value', {
          centroid: doc.getCentroid(),
          result: {
            type: layer,
            values: parent
          }
        });
      }

      // find next parent
      parentIdentity = _.get(hierarchy, parentIdentity)
    }

    // do not check other layers
    break;
  }
}

module.exports = { create }
