const run = require('../compose/run').handler

module.exports = {
  command: 'geonames',
  describe: '(re)download geonames data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'geonames', './bin/download'] })
  }
}
