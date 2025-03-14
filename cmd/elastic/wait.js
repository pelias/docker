const sleep = require('atomic-sleep');
const status_helper = require('./status_helper')

const retry_count = 30;

module.exports = {
    command: 'wait',
    describe: 'wait for elasticsearch to start up',
    handler: () => {
        console.log('waiting for elasticsearch service to come up');
        for (let i = 0; i < retry_count; i++) {
            if (status_helper == 200) {
                console.log('Elasticsearch up!');
                return;
            }
            else if (status_helper === 408) {
                //Use process.stdout to avoid a forced newline
                process.stdout.write(':')
            }
            else {
                process.stdout.write('.')
            }
            sleep(1000);
        }
        console.error("\nElasticsearch did not come up, check configuration");
        return;

    }
}