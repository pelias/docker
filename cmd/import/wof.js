const run = require('../compose/run').handler

module.exports = {
  command: 'wof',
  describe: '(re)import whosonfirst data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'whosonfirst', './bin/start'] })
  }
}
