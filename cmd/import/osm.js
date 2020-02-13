const run = require('../compose/run').handler

module.exports = {
  command: 'osm',
  describe: '(re)import openstreetmap data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'openstreetmap', './bin/start'] })
  }
}
