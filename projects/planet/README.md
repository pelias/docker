
# Full Planet Build

This project is configured to download/prepare/build a complete Pelias installation for the entire planet.

### Minimum Requirements
* 600GB Disk
* 16GB RAM
* 16+ CPU cores or a lot of patience

### Recommended requirements:

* 600GB fast disk (such as NVMe SSD)
* 48GB RAM
* 36 CPU cores

## Time requirements

With a 36 CPU machine and fast network connection, full planet builds can take as little as 16 hours.

It's not recommended to run full planet builds on consumer hardware (such as a standard 8 core, 16GB RAM laptop or desktop) unless you are willing to wait up to 72 hours.

## Setup

Please refer to the instructions at https://github.com/pelias/docker in order to install and configure your docker environment.

The minimum configuration required in order to run this project are [installing prerequisites](https://github.com/pelias/docker#prerequisites), [install the pelias command](https://github.com/pelias/docker#installing-the-pelias-command) and [configure the environment](https://github.com/pelias/docker#configure-environment).

Please ensure that's all working fine before continuing.

## Acceptance tests

This project uses [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to pull in the [pelias/acceptance-test](https://github.com/pelias/acceptance-tests/) repository to allow testing full planet builds.

### Caveats

A full planet build will require a street polylines file generated with Valhalla. Please see [the documentation](https://github.com/pelias/polylines/wiki/Generating-polylines-from-Valhalla) on how to perform that build.

## Run a Build

To run a complete build, execute the following commands:

```bash
git submodule init
git submodule update

pelias compose pull
pelias elastic start
pelias elastic wait
pelias elastic create
pelias download all
pelias prepare all
pelias import all
pelias compose up

pelias test run
```

# Make an Example Query

You can now make queries against your new Pelias build:

http://localhost:4000/v1/search?text=london
