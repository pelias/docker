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

# run build
pelias compose pull
pelias elastic start
sleep 30
pelias elastic wait
pelias elastic create
pelias download all
pelias prepare all
pelias import all
pelias compose up

# optionally run tests
# pelias test run
