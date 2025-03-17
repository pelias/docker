const run = require('../compose/run').handler
module.exports = {
    command: 'run',
    describe: 'run fuzzy-tester test cases',
    handler: () => {
        run({ _: ['compose', 'run', 'fuzzy-tester', '-e docker'] })
    }
}