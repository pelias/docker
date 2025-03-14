const run = require('../compose/run').handler

module.exports = {
  command: 'polylines',
  describe: 'export road network from openstreetmap into polylines format',
  handler: () => {
    run({ _: ['compose', 'run', 'polylines', 'bash', './docker_extract.sh'] })
  }
}
