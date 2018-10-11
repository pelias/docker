# base image
FROM ubuntu:16.04

# configure env
ENV DEBIAN_FRONTEND 'noninteractive'

RUN apt-get update && apt-get install -y locales apt-utils iputils-ping curl wget git-core autoconf automake libtool pkg-config python

RUN apt-get install -y software-properties-common && \
    apt-get update

RUN add-apt-repository -y ppa:valhalla-core/valhalla && \
    apt-get update

RUN apt-get install -y valhalla-bin

# configure volumes
VOLUME "/data"


# generate valhalla config
RUN valhalla_build_config \
  --mjolnir-tile-dir '/data/valhalla/valhalla_tiles' \
  --mjolnir-tile-extract '/data/valhalla/valhalla_tiles.tar' \
  --mjolnir-timezone '/data/valhalla/valhalla_tiles/timezones.sqlite' \
  --mjolnir-admin '/data/valhalla/valhalla_tiles/admins.sqlite' > valhalla.json

# build script to build tiles and export polyline data.
RUN echo 'mkdir -p /data/valhalla/valhalla_tiles\n' \
         'touch /data/valhalla/valhalla_tiles/timezones.sqlite\n' \
         'touch /data/valhalla/valhalla_tiles/admins.sqlite\n' \
         'mkdir -p /data/polylines\n' \
         'valhalla_build_tiles -c valhalla.json /data/openstreetmap/*.osm.pbf;\n' \
         'find /data/valhalla/valhalla_tiles | sort -n | tar cf /data/valhalla/valhalla_tiles.tar --no-recursion -T - \n' \
         'valhalla_export_edges --config valhalla.json >> /data/polylines/extract.0sv;' > ./docker_build.sh