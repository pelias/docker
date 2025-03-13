const child = require('child_process')
const oldOrNewCompose = require('./oldOrNewCompose')
const options = { stdio: 'inherit', shell:true }

module.exports = {
  command: 'up',
  describe: 'start one or more docker compose service(s)',
  handler: (argv) => {
    child.spawnSync(oldOrNewCompose(), ['up', '-d', ...argv._.slice(2)], options)
  }
}
