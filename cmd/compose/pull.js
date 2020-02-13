const child = require('child_process')
const options = { stdio: 'inherit' }

module.exports = {
  command: 'pull',
  describe: 'update all docker images',
  handler: (argv) => {
    child.spawnSync('docker-compose', ['pull'], options)
  }
}
