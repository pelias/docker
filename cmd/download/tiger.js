const run = require('../compose/run').handler

module.exports = {
  command: 'tiger',
  describe: '(re)download TIGER data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'interpolation', './bin/download-tiger'] })
  }
}
