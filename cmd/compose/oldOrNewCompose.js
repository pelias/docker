const child = require('child_process')
const oldOrNewCompose = require('./oldOrNewCompose')
const options = { stdio: 'ignore', shell:true }

module.exports = function oldOrNewCompose(){
    if(child.spawnSync('docker compose version', options).status==0){
        return 'docker compose';
    }
    return 'docker-compose'
}