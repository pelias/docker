module.exports = {
  command: 'compose <cmd>',
  describe: 'shortcuts to running docker compose directly',
  builder: (yargs) => yargs
    .commandDir('compose')
    .usage('$0 <cmd> [args]')
    .demandCommand(1, '')
}
