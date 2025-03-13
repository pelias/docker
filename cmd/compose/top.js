const child = require('child_process')
const oldOrNewCompose = require('./oldOrNewCompose')
const options = { stdio: 'inherit' , shell: true}

module.exports = {
  command: 'top',
  describe: 'display the running processes of a container',
  handler: (argv) => {
    child.spawnSync(oldOrNewCompose(), argv._.slice(1), options)
  }
}
