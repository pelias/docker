#!/bin/bash
set -e;

# per-source prepares
function prepare_polylines(){ compose_run -T 'polylines' bash ./docker_extract.sh; }
function prepare_interpolation(){ compose_run -T 'interpolation' bash ./docker_build.sh; }
function prepare_placeholder(){
  compose_run -T 'placeholder' ./cmd/extract.sh;
  compose_run -T 'placeholder' ./cmd/build.sh;
}

function prepare_spatial(){
  compose_run -T --entrypoint='bash' 'spatial' << 'EOF'
    #!/bin/bash
    set -euo pipefail

    TARGET_DB='/data/spatial/docker.spatial.db'
    WOF_SQLITE_DIR='/data/whosonfirst/sqlite'
    SQL_EXTRACT_QUERY="SELECT json_extract(body, '$') FROM geojson"

    mkdir -p $(dirname "${TARGET_DB}")
    rm -rf "${TARGET_DB}"

    export_all_wof_databases_as_geojson() {
      for db in $(find "${WOF_SQLITE_DIR}" -name '*.db' -type f -maxdepth 1); do
        1>&2 echo "[reading] $(basename ${db})"
        /opt/spatial/bin/sqlite3 "${db}" "${SQL_EXTRACT_QUERY}"
      done
    }

    export_all_wof_databases_as_geojson \
      | node bin/spatial.js import whosonfirst --db="${TARGET_DB}"
EOF
}

register 'prepare' 'polylines' 'export road network from openstreetmap into polylines format' prepare_polylines
register 'prepare' 'interpolation' 'build interpolation sqlite databases' prepare_interpolation
register 'prepare' 'placeholder' 'build placeholder sqlite databases' prepare_placeholder
register 'prepare' 'spatial' 'build spatial database' prepare_spatial

# prepare all the data to be used by imports
function prepare_all(){
  prepare_polylines &
  prepare_placeholder &
  wait
  prepare_interpolation
}

register 'prepare' 'all' 'build all services which have a prepare step' prepare_all
