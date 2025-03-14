
module.exports = {
  command: 'all',
  describe: 'build all services which have a prepare step',
  handler: () => {
    require('./polylines').handler();
    require('./placeholder').handler();
    require('./interpolation').handler();
  }
}
