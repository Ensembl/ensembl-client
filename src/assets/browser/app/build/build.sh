#! /bin/bash

pushd $(dirname "${0}") > /dev/null
BASE=$(pwd -L)
popd > /dev/null

if [ $# -lt 1 ]
then
    echo "Usage: $0 <task>"
    exit
fi

case "$1" in
    start)
        echo "Running web start"
        cargo +nightly web start --target=wasm32-unknown-unknown --release
        ;;
    deploy)
        echo "Running deploy"
        $BASE/deploy.sh
        ;;
    *)
        echo "Unknown command '$1'"
        ;;
esac
