#!/bin/bash
set -e;

function elastic_schema_drop(){ compose_run 'schema' node scripts/drop_index "$@" || true; }
function elastic_schema_create(){ compose_run 'schema' npm run create_index; }
function elastic_start(){ compose_exec up -d elasticsearch; }
function elastic_stop(){ compose_exec kill elasticsearch; }

register 'elastic' 'drop' 'delete elasticsearch index & all data' elastic_schema_drop
register 'elastic' 'create' 'create elasticsearch index with pelias mapping' elastic_schema_create
register 'elastic' 'start' 'start elasticsearch server' elastic_start
register 'elastic' 'stop' 'stop elasticsearch server' elastic_stop

# to use this function:
# if test $(elastic_status) -ne 200; then
function elastic_status(){ curl --output /dev/null --silent --write-out "%{http_code}" "http://${ELASTIC_HOST:-localhost:9200}" || true; }

# the same function but with a trailing newline
function elastic_status_newline(){ echo $(elastic_status); }
register 'elastic' 'status' 'HTTP status code of the elasticsearch service' elastic_status_newline

function elastic_wait(){
  echo 'waiting for elasticsearch service to come up';
  until test $(elastic_status) -eq 200; do
    printf '.'
    sleep 2
  done
  echo
}

register 'elastic' 'wait' 'wait for elasticsearch to start up' elastic_wait
