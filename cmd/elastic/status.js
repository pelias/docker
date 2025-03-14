const status_helper = require('./status_helper')

module.exports = {
    command: 'status',
    describe: 'HTTP status code of the elasticsearch service',
    handler: async () => {
        let status = await status_helper.getStatus()
        switch (status) {
            case 200:
                console.log("200");
                break;
            default:
                console.error(status.statusCode);
                break;
        }
    }
}
