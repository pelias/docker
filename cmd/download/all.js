const env = require('../../lib/env')()

module.exports = {
  command: 'all',
  describe: '(re)download all data',
  handler: (argv) => {

    // @todo: make this parallel
    // like it was with the bash script

    require('./wof').handler()
    require('./oa').handler()
    require('./osm').handler()

    if (env.ENABLE_GEONAMES === 'true'){
      require('./geonames').handler()
    }

    require('./tiger').handler()
    require('./transit').handler()
    require('./csv').handler()
  }
}
