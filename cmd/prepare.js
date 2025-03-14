module.exports = {
    command: 'prepare <cmd>',
    describe: 'prepare source data before the import',
    builder: (yargs) => yargs
      .commandDir('prepare')
      .usage('$0 <cmd> [args]')
      .demandCommand(1, '')
  }
  