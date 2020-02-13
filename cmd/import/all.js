const env = require('../../lib/env')()

module.exports = {
  command: 'all',
  describe: '(re)import all data',
  handler: (argv) => {

    require('./wof').handler()
    require('./oa').handler()
    require('./osm').handler()
    require('./polylines').handler()

    if (env.ENABLE_GEONAMES === 'true'){
      require('./geonames').handler()
    }

    require('./transit').handler()
    require('./csv').handler()
  }
}
