const child = require('child_process')
const options = { stdio: 'inherit' }

module.exports = {
  command: 'down',
  describe: 'stop all docker-compose service(s)',
  handler: (argv) => {
    child.spawnSync('docker-compose', ['down'], options)
  }
}
