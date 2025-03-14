const sleep = require('atomic-sleep');
const status_helper = require('./status_helper')

const retry_count = 30;

module.exports = {
    command: 'wait',
    describe: 'wait for elasticsearch to start up',
    handler: async () => {
        console.log('waiting for elasticsearch service to come up');
        for (let i = 0; i < retry_count; i++) {
            let status = await status_helper.getStatus();
            if (status.statusCode == 200) {
                console.log('Elasticsearch up!');
                return;
            }
            //408 indicates the server is up but not yet yellow status
            else if (status.statusCode === 408) {
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