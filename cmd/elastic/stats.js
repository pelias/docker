const http = require('http');

const options = {
    hostname: process.env.ELASTIC_HOST || 'localhost',
    port: 9201,
    path: `/${process.env.ELASTIC_INDEX || 'pelias'}/_search?request_cache=true&timeout=10s&pretty=true`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};


const data = JSON.stringify({
    aggs: {
        sources: {
            terms: {
                field: 'source',
                size: 100,
            },
            aggs: {
                layers: {
                    terms: {
                        field: 'layer',
                        size: 100,
                    },
                },
            },
        },
    },
    size: 0,
});


module.exports = {
    command: 'stats',
    describe: 'display a summary of doc counts per source/layer',
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

        req.write(data);

        req.end();
    }
}
