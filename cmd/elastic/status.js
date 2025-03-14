const status_helper = require('./status_helper')

module.exports = {
    command: 'status',
    describe: 'HTTP status code of the elasticsearch service',
    handler: () => {
        switch (status_helper.getStatus()) {
            case 200:
                console.log("200");
                break;
            default:
                console.error(status_helper.getStatus().statusCode);
                break;
        }
    }
}
