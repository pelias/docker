module.exports = {
    command: 'system <cmd>',
    describe: 'run system commands',
    builder: (yargs) => yargs
      .commandDir('system')
      .usage('$0 <cmd> [args]')
      .demandCommand(1, '')
  }
  