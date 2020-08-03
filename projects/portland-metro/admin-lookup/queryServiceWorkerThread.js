const _ = require('lodash')
// const codec = require('./codec')
const threads = require('worker_threads')

const QueryService = require('/code/spatial/service/QueryService')
const middleware = require('/code/spatial/server/routes/pip_beta')
const service = new QueryService({
  readonly: true,
  filename: '/data/spatial/docker.spatial.db'
})

const adminLayers = [
  'neighbourhood', 'borough',
  'locality', 'localadmin',
  'county', 'macrocounty',
  'region', 'macroregion',
  'dependency', 'country',
  'empire', 'continent'
]

threads.parentPort.on('message', ({ centroid, port }) => {
  // console.error('worker message', doc)
  // doc = codec.unmarshal(doc)

  // generate query
  const query = {
    lon: centroid.lon,
    lat: centroid.lat,
    lang: 'und',
    tag: 'default'
  }

  lookup(query, (err, res) => {
    if (err) {
      console.error('worker error', err)
      port.postMessage({ err });
      port.close();
      return
    }

    const addParent = []
    mapPIPResultsToDocument(addParent, res)
    port.postMessage({ addParent })
    port.close()

    // console.error('mapped', doc)

    // port.postMessage({ doc });
    // port.close();
  })
});

console.error('worker start')

function lookup(query, cb) {

  const req = {}
  _.set(req, 'app.locals.service', service)
  _.set(req, 'query', query)

  const res = {}
  res.status = () => res
  res.json = (data) => cb(null, data)

  middleware(req, res)
}

function mapPIPResultsToDocument(foo, res) {
  const hits = _.get(res, 'hits', [])
  const place = _.get(res, 'place', {})
  const name = _.get(res, 'name', {})
  let hierarchy = _.get(res, 'hierarchy', {})

  // hard-core the WOF hierarchy branch to use
  const branch = 'wof:0'
  hierarchy = _.get(hierarchy, branch, {})

  // iterate over layers from most granular to least granular
  for (const layer of adminLayers) {

    let parentIdentity = _.find(hits, (identity) => {
      const p = _.get(place, identity)
      return _.get(p, 'type') === layer && _.get(p, 'class') === 'admin'
    })

    // no match found at this layer
    if (!parentIdentity) { continue }

    // walk hierarchy to add parents
    const seen = {}
    while (parentIdentity) {

      // prevent infinite recursion
      if (_.has(seen, parentIdentity)) { break }
      _.set(seen, parentIdentity);

      // load parent data
      const parent = {
        place: _.get(place, parentIdentity),
        name: _.get(_.get(name, parentIdentity), 'und|default')
      }

      // parent not found (not loaded into the spatial DB?)
      if (!_.has(parent, 'place.id')) {
        // logger.warn(`parent not found: ${parentIdentity}`);
        break
      }

      // call postmessage with parents to add
      try {
        foo.push([
          _.get(parent, 'place.type'),
          _.get(parent, 'name.name[0]'),
          _.get(parent, 'place.id'),
          _.get(parent, 'name.abbr[0]')
        ])
      }
      catch (err) {
        logger.warn('invalid value', {
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
