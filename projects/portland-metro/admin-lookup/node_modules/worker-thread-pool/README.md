# worker-thread-pool

[![Build Status](https://travis-ci.org/SerayaEryn/worker-thread-pool.svg?branch=master)](https://travis-ci.org/SerayaEryn/worker-thread-pool)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/worker-thread-pool/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/worker-thread-pool?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![NPM version](https://img.shields.io/npm/v/worker-thread-pool.svg?style=flat)](https://www.npmjs.com/package/worker-thread-pool) [![Greenkeeper badge](https://badges.greenkeeper.io/SerayaEryn/worker-thread-pool.svg)](https://greenkeeper.io/)

An easy way to create a pool of worker threads.

## Usage

If being used with node v10.5.0 to v11.6.0 the `worker-thread-pool` module requires node to be started with the `--experimental-worker` flag.

```js
//main.js
const Pool = require('worker-thread-pool');

const pool = new Pool({
  path: __dirname + '/worker.js'
});
pool.run({name: 'world'})
  .then((result) => {
    //...
  })
```

```js
//worker.js
const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
  message.port.postMessage('hello ' + message.name);
  message.port.close();
});
```

## API

### Pool(options)

Creates a new pool with workers for the specified javascript file.

#### options

##### path

The path to the javascript file containing the source code to be executed in the thread pool.

##### size (optional)

The size of the thread pool. Defaults to `4`.

### Pool#run(workerData)

Passes the `workerData` to the worker and waits until the worker sends back an answer. Resolves the answer of the worker in a Promise.

### Poll#queueLength()

Returns the current length of the queue.

### Poll#poolLength()

Returns the current size of the pool.

### Pool#close()

Removes all workers from the pool, calls `terminate` on them and then emits a `close` event. 
If an error occurs during an `error` event will be emitted.

## License

[MIT](./LICENSE)