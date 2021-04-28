#!/bin/bash
set -x

if [ -z $1 ]
then
  echo "Error: No project path as script parameter like projects/bw"
  exit
fi

# install pelias script
# this is the _only_ setup command that should require `sudo`
sudo ln -s "$(pwd)/pelias" /usr/local/bin/pelias

# cd into the project directory
cd $1 || exit

# create a directory to store Pelias data files
# see: https://github.com/pelias/docker#variable-data_dir
# note: use 'gsed' instead of 'sed' on a Mac
mkdir ./data
sed -i '/DATA_DIR/d' .env
echo 'DATA_DIR=./data' >> .env

# This section updates all docker images
pelias compose pull
# This section creates an elasticsearch database
pelias elastic start
# This section waites until elastic search docker container has started
sleep 30
# This section makes a http call to verify the elastic search database exists
pelias elastic wait
# This section creates an index for pelias
pelias elastic create
# This section downloads all data
pelias download all
# This section prepares data for polylines, placeholder and interpolation
pelias prepare all
# This section imports the data into elasticsearch
pelias import all
# This section starts pelias
pelias compose up

# optionally run tests
# pelias test run
