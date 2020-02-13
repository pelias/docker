const child = require('child_process')
const options = { stdio: 'inherit' }

module.exports = {
  command: 'exec',
  describe: 'execute an arbitrary docker-compose command',
  handler: (argv) => {
    child.spawnSync('docker-compose', argv._.slice(1), options)
  }
}
