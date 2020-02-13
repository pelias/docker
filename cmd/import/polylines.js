const run = require('../compose/run').handler

module.exports = {
  command: 'polylines',
  describe: '(re)import polylines data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'interpolation', './bin/start'] })
  }
}
