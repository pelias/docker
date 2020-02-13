const child = require('child_process')
const options = { stdio: 'inherit' }

module.exports = {
  command: 'kill',
  describe: 'kill one or more docker-compose service(s)',
  handler: (argv) => {
    child.spawnSync('docker-compose', argv._.slice(1), options)
  }
}
