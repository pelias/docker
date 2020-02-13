#!/bin/bash
set -e;

# disable verbose logging
ENV_DISPLAY_WARNINGS=false

# ensure docker runs containers as the current user (even when running with sudo)
# note: SUDO_USER is not portable to all systems but its the best we've got.
function set_docker_user(){
  CURRENT_USER=$(id -u ${SUDO_USER-${USER}}):$(id -g ${SUDO_USER-${USER}})
  if [ ! -z "${DOCKER_USER}" ] && [ "${DOCKER_USER}" != "${CURRENT_USER}" ]; then
    2>&1 printf "WARNING: The DOCKER_USER env var is deprecated, using %s.\n" ${CURRENT_USER}
    2>&1 echo "Remove the DOCKER_USER line from your .env file to silence this message."
  fi
  export DOCKER_USER="${CURRENT_USER}";
}

# ensure the user environment is correctly set up
function env_check(){
  if [ "${DOCKER_USER}" = "0:0" ]; then
    echo "You are running as root"
    echo "This is insecure and not supported by Pelias."
    echo "Please try again as a non-root user."
    exit 1
  fi

  if [ -z "${DATA_DIR}" ]; then
    echo "You must set the DATA_DIR env var to a valid directory on your local machine."
    echo
    echo "Edit the '.env' file in this repository, update the DATA_DIR to a valid path and try again."
    echo "Alternatively, you can set the variable in your environment using a command such as 'export DATA_DIR=/tmp'."
    exit 1
  elif [ ! -d "${DATA_DIR}" ]; then
    printf "The directory specified by DATA_DIR does not exist: %s\n" ${DATA_DIR}
    echo
    echo "Edit the '.env' file in this repository, update the DATA_DIR to a valid path and try again."
    echo "Alternatively, you can set the variable in your environment using a command such as 'export DATA_DIR=/tmp'."
    exit 1
  fi
}

# loads environment vars from a stream (such as a file)
# example: env_load_stream < .env
function env_load_stream(){
  [[ -n $DATA_DIR ]] && printf "DATA_DIR is already set to '$DATA_DIR' - this may cause the DATA_DIR specified in the .env to be ignored\n"
  while IFS='=' read -r key value; do
    ([ -z $key ] || [ -z $value ]) && printf 'Invalid environment var "%s=%s"\n' $key $value && exit 1
    if [ -z ${!key} ]; then
      export "${key}=${value}"
    elif $ENV_DISPLAY_WARNINGS; then
      printf '[warn] skip setting environment var "%s=%s", already set "%s=%s"\n' $key $value $key ${!key}
    fi
  done
}

# ensure locale is correctly set?
# export LC_ALL=en_US.UTF-8

# load DATA_DIR and other vars from docker compose .env file
# note: strips comments and empty lines
[ -f .env ] && env_load_stream < <(grep -v '^$\|^\s*$\#' .env)

# use the default compose file unless one was specified
# if [ -z "${COMPOSE_FILE}" ]; then
#   if [ ! -f "docker-compose.yml" ]; then
#     export COMPOSE_FILE="${BASEDIR}/docker-compose.yml"
#   fi
# fi

set_docker_user

# ensure the user env is correctly set up
env_check
