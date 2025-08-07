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

function compose_exec(){
  # Check if a local compose file exists. If not use the global one.
  if [ ! -f docker-compose.yml ];then
    echo "No local file. Using global compose file."
    globalComposeFile="1"
    export peliasRegion="projects/$(basename $(pwd))"
    cd ../..;
  fi
  # the 'docker compose' subcommand is now the recommended method of calling compose.
  # if not available, we fallback to the legacy 'docker-compose' command.
  NATIVE_COMPOSE_VERSION=$(docker compose version 2> /dev/null || true)
  if [ -z "$NATIVE_COMPOSE_VERSION" ]; then
    docker-compose $@;
  else
    docker compose $@;
  fi
  if [ $globalComposeFile ] ;then
    echo "Going back to $peliasRegion"
    cd "./$peliasRegion"
    unset $globalComposeFile
  fi
}
register 'compose' 'exec' 'execute an arbitrary `docker compose` command' compose_exec

function compose_run(){ net_init; compose_exec run --rm $@; }
register 'compose' 'run' 'execute a `docker compose` run command' compose_run

function compose_up(){ compose_exec up -d $@; }
register 'compose' 'up' 'start one or more `docker compose` service(s)' compose_up

function compose_kill(){ compose_exec kill $@; }
register 'compose' 'kill' 'kill one or more `docker compose` service(s)' compose_kill

function compose_down(){ compose_exec down; }
register 'compose' 'down' 'stop all `docker compose` service(s)' compose_down
