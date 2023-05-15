#!/bin/bash
set -e;

function net_init(){
  docker network create ${COMPOSE_PROJECT_NAME}_default &>/dev/null || true
}

function compose_pull(){ compose_exec pull; }
register 'compose' 'pull' 'update all docker images' compose_pull

function compose_logs(){ compose_exec logs $@; }
register 'compose' 'logs' 'display container logs' compose_logs

function compose_ps(){ compose_exec ps $@; }
register 'compose' 'ps' 'list containers' compose_ps

function compose_top(){ compose_exec top $@; }
register 'compose' 'top' 'display the running processes of a container' compose_top

function compose_exec(){ compose_switch; $compose_version $@; }
register 'compose' 'exec' 'execute an arbitrary docker-compose command' compose_exec

function compose_run(){ net_init; compose_switch; $compose_version run --rm $@; }
register 'compose' 'run' 'execute a docker-compose run command' compose_run

function compose_up(){ compose_switch; $compose_version up -d $@; }
register 'compose' 'up' 'start one or more docker-compose service(s)' compose_up

function compose_kill(){ compose_switch; $compose_version kill $@; }
register 'compose' 'kill' 'kill one or more docker-compose service(s)' compose_kill

function compose_down(){ compose_switch; $compose_version down; }
register 'compose' 'down' 'stop all docker-compose service(s)' compose_down
compose_version="";
function compose_switch(){
  if [ $(docker compose version >/dev/null 2>&1 ; echo $?) -ne 0 ];
  then
     compose_version="docker compose"
  elif [ $(docker compose-version >/dev/null 2>&1 ; echo $?) -ne 0 ];
  then
    compose_version="docker-compose"
  else
    echo "No docker compose version found"
    exit 127
  fi
}