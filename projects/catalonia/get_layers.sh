#!/bin/bash


curl -XGET localhost:9200/pelias/_search -d '{
  "size": 0,
  "aggs" : {
    "layers" : {
      "terms" : { "field" : "layer" }
    },
    "sources" : {
      "terms" : { "field" : "source" }
    }
  }
}'
