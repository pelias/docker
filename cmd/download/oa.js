const run = require('../compose/run').handler

module.exports = {
  command: 'oa',
  describe: '(re)download openaddresses data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'openaddresses', './bin/download'] })
  }
}
