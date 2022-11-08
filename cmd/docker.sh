#!/bin/bash
set -e;

# We default to use docker-compose if its installed on the system. If not we will use docker compose
if ! command -v docker-compose &> /dev/null
then
    DOCKER_COMPOSE_COMMAND="docker compose"
    exit
else 
    DOCKER_COMPOSE_COMMAND="docker-compose"
fi

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

function compose_exec(){ ${DOCKER_COMPOSE_COMMAND} $@; }
register 'compose' 'exec' 'execute an arbitrary ${DOCKER_COMPOSE_COMMAND} command' compose_exec

function compose_run(){ net_init; ${DOCKER_COMPOSE_COMMAND} run --rm $@; }
register 'compose' 'run' 'execute a ${DOCKER_COMPOSE_COMMAND} run command' compose_run

function compose_up(){ ${DOCKER_COMPOSE_COMMAND} up -d $@; }
register 'compose' 'up' 'start one or more ${DOCKER_COMPOSE_COMMAND} service(s)' compose_up

function compose_kill(){ ${DOCKER_COMPOSE_COMMAND} kill $@; }
register 'compose' 'kill' 'kill one or more ${DOCKER_COMPOSE_COMMAND} service(s)' compose_kill

function compose_down(){ ${DOCKER_COMPOSE_COMMAND} down; }
register 'compose' 'down' 'stop all ${DOCKER_COMPOSE_COMMAND} service(s)' compose_down

