#!/bin/bash
set -e;

# run acceptance tests
function test_fuzzy(){ compose_run 'fuzzy-tester' -e 'docker' $@; }
function test_acceptance() { compose_run 'acceptance-tests' npm test -- -e 'docker' $@; }

register 'test' 'run' 'run fuzzy-tester test cases' test_fuzzy
register 'test' 'acceptance-tests' 'run acceptance-tests test cases' test_acceptance