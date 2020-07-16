#!/bin/bash
set -e;

function check_docker_memory(){
  DOCKER_TOTAL_MEMORY=`docker info | grep "Total Memory" | awk -F' ' '{print $3;}'`;
  if [ -z "${DOCKER_TOTAL_MEMORY##*MiB}" ]; then
    echo " Docker 'Total Memory' is measured in MiB, this is too low to run prepare polylines, please increase. See 'docker info' for full configuration."
    exit 1
  fi

  if [ ${DOCKER_TOTAL_MEMORY/GiB/} \< 7.6 ]; then 
    echo "Docker total memory is less than 4GB, prepare polylines will fail";
    exit 1
  fi;
}

# per-source prepares
function prepare_polylines(){ check_docker_memory; compose_run -T 'polylines' bash ./docker_extract.sh; }
function prepare_interpolation(){ compose_run -T 'interpolation' bash ./docker_build.sh; }
function prepare_placeholder(){
  compose_run -T 'placeholder' ./cmd/extract.sh;
  compose_run -T 'placeholder' ./cmd/build.sh;
}

register 'prepare' 'polylines' 'export road network from openstreetmap into polylines format' prepare_polylines
register 'prepare' 'interpolation' 'build interpolation sqlite databases' prepare_interpolation
register 'prepare' 'placeholder' 'build placeholder sqlite databases' prepare_placeholder

# prepare all the data to be used by imports
function prepare_all(){
  prepare_polylines &
  prepare_placeholder &
  wait
  prepare_interpolation
}

register 'prepare' 'all' 'build all services which have a prepare step' prepare_all
