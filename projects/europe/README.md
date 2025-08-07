# Europe area

This project is configured to download/prepare/build a complete Pelias installation for Europe.

# Setup

Please refer to the instructions at <https://github.com/pelias/docker> in order to install and configure your docker environment.

The minimum configuration required in order to run this project are [installing prerequisites](https://github.com/pelias/docker#prerequisites), [install the pelias command](https://github.com/pelias/docker#installing-the-pelias-command) and [configure the environment](https://github.com/pelias/docker#configure-environment).

Please ensure that's all working fine before continuing.

# Run a Build

To run a complete build, execute the following commands:

```bash
cp pelias-download.json pelias.json
pelias compose pull
pelias elastic start
pelias elastic wait
pelias elastic create
pelias download all
```

Download OpenAddresses full Europe :
```bash
data_dir=...
mkdir ${data_dir}/openaddresses
curl -s -L -X GET -o /tmp/europe.zip https://data.openaddresses.io/openaddr-collected-europe.zip
unzip -o -qq -d ${data_dir}/openaddresses /tmp/europe.zip
rm /tmp/europe.zip
```

```bash
cp pelias-prepare-import.json pelias.json
pelias prepare all
pelias import all
pelias compose up
```

# Make an Example Query

You can now make queries against your new Pelias build:

<http://localhost:4000/v1/search?text=Paris>
