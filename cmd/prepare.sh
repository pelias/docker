#!/bin/bash
set -e;

# per-source prepares
function prepare_polylines(){ compose_run 'polylines' bash ./docker_extract.sh; }
# alternative creation method for polyline data using valhalla
function prepare_valhalla(){ compose_run 'valhalla' bash ./docker_build.sh; }
function prepare_interpolation(){ compose_run 'interpolation' bash ./docker_build.sh; }
function prepare_placeholder(){
  compose_run 'placeholder' ./cmd/extract.sh;
  compose_run 'placeholder' ./cmd/build.sh;
}

register 'prepare' 'polylines' 'export road network from openstreetmap into polylines format' prepare_polylines
register 'prepare' 'valhalla' 'export road network from openstreetmap into polylines format using valhalla' prepare_valhalla
register 'prepare' 'interpolation' 'build interpolation sqlite databases' prepare_interpolation
register 'prepare' 'placeholder' 'build placeholder sqlite databases' prepare_placeholder

# prepare all the data to be used by imports
function prepare_all(){
  prepare_polylines &
  prepare_placeholder &
  wait
  prepare_interpolation
}

function prepare_all_valhalla(){
  prepare_valhalla &
  prepare_placeholder &
  wait
  prepare_interpolation
}

register 'prepare' 'all' 'build all services which have a prepare step' prepare_all
register 'prepare' 'all_valhalla' 'build all services which have a prepare step using valhalla for polylines' prepare_all_valhalla