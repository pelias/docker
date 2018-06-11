#!/bin/bash
set -e;

declare -a commands
declare -a actions
declare -a hints
declare -a functions

function register(){
  commands+=("$1")
  actions+=("$2")
  hints+=("$3")
  functions+=("$4")
}

function help(){
  printf 'Usage: %s [command] [action] [options]\n\n' ${0}

  for (( i = 0; i < ${#commands[@]}; ++i )); do
    echo -e "  ${commands[$i]}\t${actions[$i]}\t          ${hints[$i]}"
  done | column -ts $'\t'

  echo
}

function cli(){
  cmd="${1}"; shift || true
  action="${1}"; shift || true
  valid_command=false
  valid_action=false

  for (( i = 0; i < ${#commands[@]}; ++i )); do
    if [ "${cmd}" = "${commands[$i]}" ]; then
      valid_command=true
      if [ "${action}" = "${actions[$i]}" ]; then
        valid_action=true
        "${functions[$i]}" "$@"
        exit $?
      fi
    fi
  done
  echo

  [ -z "${cmd}" ] || [ "$valid_command" = true ] || printf 'invalid command "%s"\n\n' "${cmd}"
  [ -z "${action}" ] || [ "$valid_action" = true ] || printf 'invalid action "%s"\n\n' "${action}"
  help

  exit 1
}
