module.exports = {
  command: 'download <cmd>',
  describe: 'fetch and update geographic data from source',
  builder: (yargs) => yargs
    .commandDir('download')
    .usage('$0 <cmd> [args]')
    .demandCommand(1, '')
}
