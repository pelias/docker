# North America Project

This project is configured to download/prepare/build a complete Pelias installation for North America.

As a fairly large build, this will require significant resources to complete quickly. It can still run on a personal computer with 8GB+ RAM, but will take a while. It will require 300GB or so of disk space.

Running an interpolation build of this side would also take many days

Additionally, it requires a polylines file generated with [Valhalla](https://github.com/valhalla).

# Setup

Please refer to the instructions at https://github.com/pelias/docker in order to install and configure your docker environment.

The minimum configuration required in order to run this project are [installing prerequisites](https://github.com/pelias/docker#prerequisites), [install the pelias command](https://github.com/pelias/docker#installing-the-pelias-command) and [configure the environment](https://github.com/pelias/docker#configure-environment).

This build also requires [obtaining or generating a polylines file from Valhalla](https://github.com/pelias/polylines/wiki/Generating-polylines-from-Valhalla). Once you have the polylines file, you must move it to `polylines/extract.0sv`. You can also download the latest `north-america-valhalla.polylines.0sv.gz`, move and rename from: https://geocode.earth/data/

Please ensure that's all working fine before continuing.

# Run a Build

To run a complete build, execute the following commands:

```bash
pelias compose pull
pelias elastic start
pelias elastic wait
pelias elastic create
pelias download all
pelias prepare placeholder
pelias import all
pelias compose up
pelias test run
```

# Make an Example Query

You can now make queries against your new Pelias build:

[http://localhost:4000/v1/search?text=empire state building](http://localhost:4000/v1/search?text=empire%20state%20building)
