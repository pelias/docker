const child = require('child_process')
const oldOrNewCompose = require('./oldOrNewCompose')
const env = require('../../lib/env')()
const options = { stdio: 'inherit' , shell: true}

function net_init() {
  const net = `${env.COMPOSE_PROJECT_NAME}_default`
  child.spawnSync('docker', ['network', 'create', net], { stdio: 'ignore' })
}

module.exports = {
  command: 'run',
  describe: 'execute a docker-compose run command',
  handler: (argv) => {
    net_init()
    child.spawnSync(oldOrNewCompose(), ['run', '--rm', ...argv._.slice(2)], options)
  }
}
