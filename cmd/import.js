module.exports = {
  command: 'import <cmd>',
  describe: 'import source data into elasticsearch',
  builder: (yargs) => yargs
    .commandDir('import')
    .usage('$0 <cmd> [args]')
    .demandCommand(1, '')
}
