const http = require('http');

const options = {
    //TODO: Allow custom values via System variable
    host: 'localhost',
    port: 9200,
    path: '_cluster/health?wait_for_status=yellow&timeout=1s',
    method: 'GET',
    timeout: 1000
};
module.exports = {
    command: 'status',
    describe: 'HTTP status code of the elasticsearch service',
    handler: () => {
        const req = http.get(options, res => {
            res.statusCode===200?console.log(res.statusCode):console.error(res.statusCode);
            res.destroy();
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
        req.on('timeout', () => {
            console.error(`Request timeouted after ${options.timeout/1000}s`);
            req.destroy();
        });
    }
}