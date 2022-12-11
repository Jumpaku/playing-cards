#!/bin/sh

set -eu

OK="OK"
for P in $(find src -regex '^.*[A-Z].*\.ts$' -print); do
    echo "${P}"
    OK="NG"
done

if [ "${OK}" = "NG" ]; then
    echo "Error: path includes not snake case"
    false
fi