const run = require('../compose/run').handler

module.exports = {
  command: 'osm',
  describe: '(re)download openstreetmap data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'openstreetmap', './bin/download'] })
  }
}
