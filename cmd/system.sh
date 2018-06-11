#!/bin/bash
set -e;

function system_check(){ env_check; }
register 'system' 'check' 'ensure the system is correctly configured' system_check

function system_env(){ env; }
register 'system' 'env' 'display environment variables' system_env

function system_update(){ git -C $(dirname "${BASH_SOURCE[0]}") pull; }
register 'system' 'update' 'update the pelias command by pulling the latest version' system_update