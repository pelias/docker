const run = require('../compose/run').handler

module.exports = {
  command: 'oa',
  describe: '(re)import openaddresses data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'openaddresses', './bin/start'] })
  }
}
