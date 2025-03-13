module.exports = {
  command: 'elastic <cmd>',
  describe: 'interact with the elastic database',
  builder: (yargs) => yargs
    .commandDir('elastic')
    .usage('$0 <cmd> [args]')
    .demandCommand(1, '')
}
