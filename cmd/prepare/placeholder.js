const run = require('../compose/run').handler

module.exports = {
  command: 'placeholder',
  describe: 'build placeholder sqlite databases',
  handler: () => {
    run({ _: ['compose', 'run', 'placeholder', 'bash', './cmd/extract.sh'] })
    run({ _: ['compose', 'run', 'placeholder', 'bash', './cmd/build.sh'] })
  }
}
