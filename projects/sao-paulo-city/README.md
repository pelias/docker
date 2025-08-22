
# City of São Paulo

This project is configured to download/prepare/build a complete Pelias installation for São Paulo city in Brazil. 

GeoSampa is the official GeoPortal of the municipality of São Paulo city, maintained by the Coordination of Production and Information Analysis (GeoInfo) of the Municipal Department of Urbanism and Licensing and is in process of implemention a Pelias server. A test version is accessible on the link http://geocodesampa.ddns.net/

# Setup

Please refer to the instructions at https://github.com/pelias/docker in order to install and configure your docker environment.

The minimum configuration required in order to run this project are [installing prerequisites](https://github.com/pelias/docker#prerequisites), [install the pelias command](https://github.com/pelias/docker#installing-the-pelias-command) and [configure the environment](https://github.com/pelias/docker#configure-environment).

Please ensure that's all working fine before continuing.

# Run a Build

To run a complete build, execute the following commands:

```bash
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

You can now make queries against your new Pelias build, for example searching for MASP (Museu de Arte de São Paulo):

http://localhost:4000/v1/search?text=MASP
