const run = require('../compose/run').handler

module.exports = {
  command: 'create',
  describe: 'create elasticsearch index with pelias mapping',
  handler: () => {
    run({ _: ['compose', 'run', 'schema', './bin/create_index'] })
  }
}