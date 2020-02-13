const run = require('../compose/run').handler

module.exports = {
  command: 'transit',
  describe: '(re)import transit data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'transit', './bin/start'] })
  }
}
