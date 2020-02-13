const child = require('child_process')
const options = { stdio: 'inherit' }

module.exports = {
  command: 'top',
  describe: 'display the running processes of a container',
  handler: (argv) => {
    child.spawnSync('docker-compose', argv._.slice(1), options)
  }
}
