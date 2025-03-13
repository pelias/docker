const run = require('../compose/run').handler

module.exports = {
    command: 'drop',
    describe: 'delete elasticsearch index & all data',
    handler: (argv) => {
        console.debug(argv)
        if(argv.f || argv.forceYes)
        run({ _: ['compose', 'run', 'schema', 'node scripts/drop_index', '-f'] })
    }
}