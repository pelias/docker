#!/bin/bash
set -e;

# run acceptance tests
function test_fuzzy(){ compose_run 'fuzzy-tester' -e 'docker' $@; }

register 'test' 'run' 'run fuzzy-tester test cases' test_fuzzy