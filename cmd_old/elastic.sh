#!/bin/bash
set -e;

function elastic_schema_drop(){ compose_run 'schema' node scripts/drop_index "$@" || true; }
function elastic_schema_create(){ compose_run 'schema' ./bin/create_index; }
function elastic_start(){
  mkdir -p $DATA_DIR/elasticsearch
  # attemp to set proper permissions if running as root
  chown $DOCKER_USER $DATA_DIR/elasticsearch 2>/dev/null || true
  compose_exec up -d elasticsearch
}

function elastic_stop(){ compose_exec kill elasticsearch; }

register 'elastic' 'drop' 'delete elasticsearch index & all data' elastic_schema_drop
register 'elastic' 'create' 'create elasticsearch index with pelias mapping' elastic_schema_create
register 'elastic' 'start' 'start elasticsearch server' elastic_start
register 'elastic' 'stop' 'stop elasticsearch server' elastic_stop

# to use this function:
# if test $(elastic_status) -ne 200; then
function elastic_status(){
  curl \
    --output /dev/null \
    --silent \
    --write-out "%{http_code}" \
    "http://${ELASTIC_HOST:-localhost:9200}/_cluster/health?wait_for_status=yellow&timeout=1s" \
      || true;
}

# the same function but with a trailing newline
function elastic_status_newline(){ echo $(elastic_status); }
register 'elastic' 'status' 'HTTP status code of the elasticsearch service' elastic_status_newline

function elastic_wait(){
  echo 'waiting for elasticsearch service to come up';
  retry_count=30

  i=1
  while [[ "$i" -le "$retry_count" ]]; do
    if [[ $(elastic_status) -eq 200 ]]; then
      echo "Elasticsearch up!"
      exit 0
    elif [[ $(elastic_status) -eq 408 ]]; then
      # 408 indicates the server is up but not yet yellow status
      printf ":"
    else
      printf "."
    fi
    sleep 1
    i=$(($i + 1))
  done

  echo -e "\n"
  echo "Elasticsearch did not come up, check configuration"
  exit 1
}

register 'elastic' 'wait' 'wait for elasticsearch to start up' elastic_wait

function elastic_info(){ curl -s "http://${ELASTIC_HOST:-localhost:9200}/"; }
register 'elastic' 'info' 'display elasticsearch version and build info' elastic_info

function elastic_stats(){
  curl -s "http://${ELASTIC_HOST:-localhost:9200}/pelias/_search?request_cache=true&timeout=10s&pretty=true" \
    -H 'Content-Type: application/json' \
    -d '{
          "aggs": {
            "sources": {
              "terms": {
                "field": "source",
                "size": 100
              },
              "aggs": {
                "layers": {
                  "terms": {
                    "field": "layer",
                    "size": 100
                  }
                }
              }
            }
          },
          "size": 0
        }';
}
register 'elastic' 'stats' 'display a summary of doc counts per source/layer' elastic_stats
