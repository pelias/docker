#!/bin/bash
set -e;

# per-source prepares
function prepare_polylines(){ compose_run -T 'polylines' bash ./docker_extract.sh; }
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
