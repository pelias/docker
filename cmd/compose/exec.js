const child = require('child_process')
const options = { stdio: 'inherit', shell:true }

module.exports = {
  command: 'exec',
  describe: 'execute an arbitrary docker-compose command',
  handler: (argv) => {
    child.spawnSync(oldOrNewCompose(), argv._.slice(1), options)
  }
}
