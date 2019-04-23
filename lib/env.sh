#!/bin/bash
set -e;

# disable verbose logging
ENV_DISPLAY_WARNINGS=false

# ensure the user environment is correctly set up
function env_check(){
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

# load DATA_DIR and other vars from docker-compose .env file
# note: strips comments and empty lines
[ -f .env ] && env_load_stream < <(grep -v '^$\|^\s*$\#' .env)

# use the default compose file unless one was specified
# if [ -z "${COMPOSE_FILE}" ]; then
#   if [ ! -f "docker-compose.yml" ]; then
#     export COMPOSE_FILE="${BASEDIR}/docker-compose.yml"
#   fi
# fi

# ensure the user env is correctly set up
env_check
