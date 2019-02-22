#! /bin/bash

set -ev

pushd $(dirname "${0}") > /dev/null
BASE=$(pwd -L)
popd > /dev/null

SRC="$BASE/.."
DEST="$BASE/../../../../ensembl/static/browser"
cd $SRC
touch Cargo.lock # force build
RUSTFLAGS="--cfg=deploy" cargo +nightly web build --target=wasm32-unknown-unknown --release
RUSTFLAGS="--cfg=deploy" cargo +nightly web deploy --target=wasm32-unknown-unknown --release
cp $SRC/target/deploy/hellostdweb.wasm $DEST/browser.wasm
cp $SRC/target/deploy/hellostdweb.js $DEST/browser.js
sed -i -e 's~"hellostdweb.wasm"~"/static/browser/browser.wasm"~g' $DEST/browser.js
