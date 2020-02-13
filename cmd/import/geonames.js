const run = require('../compose/run').handler

module.exports = {
  command: 'geonames',
  describe: '(re)import geonames data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'geonames', './bin/start'] })
  }
}
