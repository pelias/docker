const child = require('child_process')
const options = { stdio: 'inherit' }

module.exports = {
  command: 'up',
  describe: 'start one or more docker-compose service(s)',
  handler: (argv) => {
    child.spawnSync('docker-compose', ['up', '-d', ...argv._.slice(2)], options)
  }
}
