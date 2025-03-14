const run = require('../compose/run').handler

module.exports = {
  command: 'interpolation',
  describe: 'build interpolation sqlite databases',
  handler: () => {
    run({ _: ['compose', 'run', 'interpolation', 'bash', './docker_build.sh'] })
  }
}
