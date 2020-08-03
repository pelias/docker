const _ = require('lodash')
const QueryService = require('/code/spatial/service/QueryService')
const middleware = require('/code/spatial/server/routes/pip_beta')

const service = new QueryService({
  readonly: true,
  filename: '/data/spatial/docker.spatial.db'
})

function lookup(query, cb){

  const req = {}
  _.set(req, 'app.locals.service', service)
  _.set(req, 'query', query)

  const res = {}
  res.status = () => res
  res.json = (data) => cb(null, data)

  middleware(req, res)
}

module.exports = lookup
