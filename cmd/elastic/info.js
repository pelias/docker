const http = require('http');
const options = {
    hostname: process.env.ELASTIC_HOST || 'localhost',
    port: 9200,
    path: '/',
    method: 'GET'
};
module.exports = {
    command: 'info',
    describe: 'display elasticsearch version and build info',
    handler: () => {
        const req = http.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                console.log(body);
            });

        });
        req.on('error', (e) => {
            //Differs from bash implementation. There a timeout would be silently ignored
            console.error(`Problem with request: ${e.message}`);
        });

        req.end();
    }
};