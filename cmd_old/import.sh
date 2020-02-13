#!/bin/bash
set -e;

# per-source imports
function import_wof(){ compose_run 'whosonfirst' './bin/start'; }
function import_oa(){ compose_run 'openaddresses' "./bin/parallel ${OPENADDRESSES_PARALLELISM:-1}"; }
function import_osm(){ compose_run 'openstreetmap' './bin/start'; }
function import_polylines(){ compose_run 'polylines' './bin/start'; }
function import_geonames(){ compose_run 'geonames' './bin/start'; }
function import_transit(){ compose_run 'transit' './bin/start'; }
function import_csv(){ compose_run 'csv-importer' './bin/parallel' ${CSV_PARALLELISM:-1}; }

register 'import' 'wof' '(re)import whosonfirst data' import_wof
register 'import' 'oa' '(re)import openaddresses data' import_oa
register 'import' 'osm' '(re)import openstreetmap data' import_osm
register 'import' 'polylines' '(re)import polylines data' import_polylines
register 'import' 'geonames' '(re)import geonames data' import_geonames
register 'import' 'transit' '(re)import transit data' import_transit
register 'import' 'csv' '(re)import csv data' import_csv

# import all the data to be used by imports
# note: running importers in parallel can cause issues due to high CPU & RAM requirements.
function import_all(){
  import_wof
  import_oa
  import_osm
  import_polylines

  if [[ "$ENABLE_GEONAMES" == "true" ]]; then
    import_geonames
  fi

  import_transit
  import_csv
}

register 'import' 'all' '(re)import all data' import_all
