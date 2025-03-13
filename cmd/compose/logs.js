const child = require('child_process')
const oldOrNewCompose = require('./oldOrNewCompose')
const options = { stdio: 'inherit' , shell: true}

module.exports = {
  command: 'logs',
  describe: 'display container logs',
  handler: (argv) => {
    child.spawnSync(oldOrNewCompose(), argv._.slice(1), options)
  }
}
