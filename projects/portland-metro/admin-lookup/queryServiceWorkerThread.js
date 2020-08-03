const _ = require('lodash')
const threads = require('worker_threads')

const QueryService = require('/code/spatial/service/QueryService')
const middleware = require('/code/spatial/server/routes/pip_beta')
const service = new QueryService({
  readonly: true,
  filename: '/data/spatial/docker.spatial.db'
})

threads.parentPort.on('message', (message) => {
  // console.error('worker message', message.query)

  lookup(message.query, (err, res) => {
    if (err) { console.error('worker error', err) }
    message.port.postMessage(res);
    message.port.close();
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
