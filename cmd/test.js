module.exports = {
    command: 'test <cmd>',
    describe: 'run test scenarios',
    builder: (yargs) => yargs
      .commandDir('test')
      .usage('$0 <cmd> [args]')
      .demandCommand(1, '')
  }
  