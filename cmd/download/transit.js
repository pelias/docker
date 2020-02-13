const run = require('../compose/run').handler

module.exports = {
  command: 'transit',
  describe: '(re)download transit data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'transit', './bin/download'] })
  }
}
