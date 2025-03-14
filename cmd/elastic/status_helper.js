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

function getStatus() {
    const req = http.get(options, res => {
        res.destroy();
        return ({ "statusCode": res.statusCode })
    });
    req.on('timeout', () => {
        req.destroy();
    });
    //Js interprets leading zeros as octal representation
    return ({ "statusCode": '000' });
}