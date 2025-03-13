const child = require('child_process')
const oldOrNewCompose = require('./oldOrNewCompose')
const options = { stdio: 'inherit' , shell: true}

module.exports = {
  command: 'pull',
  describe: 'update all docker images',
  handler: (argv) => {
    child.spawnSync(oldOrNewCompose(), ['pull'], options)
  }
}
