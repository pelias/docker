# base image
FROM pelias/baseimage

# grab all of the valhalla software from ppa
RUN apt-get update && \
    apt-get install -y software-properties-common python-software-properties && \
    add-apt-repository -y ppa:kevinkreiser/prime-server && \
    add-apt-repository -y ppa:valhalla-routing/valhalla && \
    apt-get update && \
    apt-get install -y valhalla-bin && \
    rm -rf /var/lib/apt/lists/*;

# change working dir
RUN mkdir -p /code/valhalla
WORKDIR /code/valhalla

# generate config
RUN valhalla_build_config \
  --mjolnir-tile-dir '/data/valhalla' \
  --mjolnir-tile-extract '/data/valhalla.tar' \
  --mjolnir-timezone '/data/valhalla/timezones.sqlite' \
  --mjolnir-admin '/data/valhalla/admins.sqlite' > valhalla.json

# build script
RUN echo 'valhalla_build_tiles -c valhalla.json /data/openstreetmap/*.osm.pbf; valhalla_export_edges --config valhalla.json > /data/polylines/pbf_extract.polyline;' > ./docker_build.sh
