const http = require('http');
const options = {
    //TODO: Allow custom values via System variable
    host: 'localhost',
    port: 9200,
    path: '_cluster/health?wait_for_status=yellow&timeout=1s',
    method: 'GET',
    timeout: 1000
};
module.exports = { getStatus };

async function getStatus() {
    return new Promise((resolve, reject) => {
        const req = http.get(options, res => {
            res.on('data', () => { });
            res.on('end', () => {
                resolve({ "statusCode": res.statusCode });
            });
        });

        req.on('error', (err) => {
            //If we don't resolve the promise it will trigger the default help message from yargs
            resolve({ "statusCode": '000' });
        });

        req.on('timeout', () => {
            req.destroy();
            //If we don't resolve the promise it will trigger the default help message from yargs
            resolve({ "statusCode": '000' });
        });
    });
}