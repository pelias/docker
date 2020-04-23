#!/bin/bash
set -e;

# per-source downloads
function download_wof(){ compose_run -T 'whosonfirst' './bin/download'; }
function download_oa(){ compose_run -T 'openaddresses' './bin/download'; }
function download_osm(){ compose_run -T 'openstreetmap' './bin/download'; }
function download_geonames(){ compose_run -T 'geonames' './bin/download'; }
function download_tiger(){ compose_run -T 'interpolation' './bin/download-tiger'; }
function download_transit(){ compose_run -T 'transit' './bin/download'; }
function download_csv(){ compose_run -T 'csv-importer' './bin/download'; }

register 'download' 'wof' '(re)download whosonfirst data' download_wof
register 'download' 'oa' '(re)download openaddresses data' download_oa
register 'download' 'osm' '(re)download openstreetmap data' download_osm
register 'download' 'geonames' '(re)download geonames data' download_geonames
register 'download' 'tiger' '(re)download TIGER data' download_tiger
register 'download' 'transit' '(re)download transit data' download_transit
register 'download' 'csv' '(re)download csv data' download_csv

# download all the data to be used by imports
function download_all(){
  download_wof &
  download_oa &
  download_osm &

  if [[ "$ENABLE_GEONAMES" == "true" ]]; then
    download_geonames &
  fi

  download_tiger &
  download_transit &
  download_csv &
  wait
}

register 'download' 'all' '(re)download all data' download_all
