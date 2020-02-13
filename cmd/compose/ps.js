const child = require('child_process')
const options = { stdio: 'inherit' }

module.exports = {
  command: 'ps',
  describe: 'list containers',
  handler: (argv) => {
    child.spawnSync('docker-compose', argv._.slice(1), options)
  }
}
