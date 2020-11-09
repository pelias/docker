#!/bin/bash

if [ -z $1 ]; then
  echo "Error: No path project like bw choosed"
  exit
fi
cd ./projects/$1 || exit
mkdir data
mkdir ./data/elasticsearch



# This section updates all docker images
echo "update all docker images"
docker-compose pull



# This section creates an elasticsearch database
echo "start elasticsearch server"
docker-compose up -d

# Here we could implement a http call to check if service started
echo "wait for elasticsearch to start up"
sleep 30



# This section creates an index for pelias
echo "create elasticsearch index with pelias mapping"
docker-compose run --rm schema ./bin/create_index



# This section downloads all data
echo "(re)download whosonfirst data"
docker-compose run --rm whosonfirst ./bin/download

# could be added if necessary
#echo "(re)download openaddresses data"
#docker-compose run --rm openaddresses ./bin/download

echo "(re)download openstreetmap data"
docker-compose run --rm openstreetmap ./bin/download

echo "(re)download geonames data"
docker-compose run --rm geonames ./bin/download

echo "(re)download interpolation data"
docker-compose run --rm interpolation ./bin/download-tiger

echo "(re)download transit data"
docker-compose run --rm transit ./bin/download

echo "(re)download csv-importer data"
docker-compose run --rm csv-importer ./bin/download



# This section prepares data for polylines, placeholder and interpolation
echo "export road network from openstreetmap into polylines format"
docker-compose run --rm polylines bash ./docker_extract.sh

echo "build placeholder sqlite databases"
docker-compose run --rm placeholder ./cmd/extract.sh
docker-compose run --rm placeholder ./cmd/build.sh

echo "build interpolation sqlite databases"
docker-compose run --rm interpolation bash ./docker_build.sh



# This section imports the data into elasticsearch
echo "(re)import whosonfirst data"
docker-compose run --rm whosonfirst ./bin/start

# could be added if necessary
#echo "(re)import openaddresses data"
#docker-compose run --rm openaddresses ./bin/start

echo "(re)import openstreetmap data"
docker-compose run --rm openstreetmap ./bin/start

echo "(re)import polylines data"
docker-compose run --rm polylines ./bin/start

echo "(re)import geonames data"
docker-compose run --rm geonames ./bin/start

echo "(re)import transit data"
docker-compose run --rm transit ./bin/start

echo "(re)import csv-importer data"
docker-compose run --rm csv-importer ./bin/start


# This section starts pelias
docker-compose up