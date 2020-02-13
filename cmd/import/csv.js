const run = require('../compose/run').handler

module.exports = {
  command: 'csv',
  describe: '(re)import CSV data',
  handler: (argv) => {
    run({ _: ['compose', 'run', 'csv-importer', './bin/start'] })
  }
}
