#!/bin/bash
set -e;

# per-source imports
function import_wof(){ compose_run 'whosonfirst' npm start; }
function import_oa(){ compose_run 'openaddresses' npm start; }
function import_osm(){ compose_run 'openstreetmap' npm start; }
function import_polylines(){ compose_run 'polylines' npm start; }
function import_transit(){ compose_run 'transit' npm start; }

register 'import' 'wof' '(re)import whosonfirst data' import_wof
register 'import' 'oa' '(re)import openaddresses data' import_oa
register 'import' 'osm' '(re)import openstreetmap data' import_osm
register 'import' 'polylines' '(re)import polylines data' import_polylines
register 'import' 'transit' '(re)import transit data' import_transit

# import all the data to be used by imports
# note: running importers in parallel can cause issues due to high CPU & RAM requirements.
function import_all(){
  import_wof
  import_oa
  import_osm
  import_polylines
  import_transit
}

register 'import' 'all' '(re)import all data' import_all
