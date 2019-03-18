#! /bin/bash

set -ev

pushd $(dirname "${0}") > /dev/null
BASE=$(pwd -L)
popd > /dev/null

SRC="$BASE/.."
DEST="$BASE/../../../../ensembl/static/browser"
cd $SRC
touch Cargo.lock # force build
if [ "$1" == "check" ] ; then
  export RUSTFLAGS="--cfg=deploy --cfg=console"
else
  export RUSTFLAGS="--cfg=deploy"
fi

cargo +nightly web build --target=wasm32-unknown-unknown --release
cargo +nightly web deploy --target=wasm32-unknown-unknown --release
cp $SRC/target/deploy/hellostdweb.wasm $DEST/browser.wasm
cp $SRC/target/deploy/hellostdweb.js $DEST/browser.js
sed -i -e 's~"hellostdweb.wasm"~"/static/browser/browser.wasm"~g' $DEST/browser.js
