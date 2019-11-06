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
  export RUSTFLAGS="--cfg=deploy --cfg=console -A warnings"
else
  export RUSTFLAGS="--cfg=deploy"
fi

cargo +nightly web build --target=wasm32-unknown-unknown --release
cargo +nightly web deploy --target=wasm32-unknown-unknown --release

echo "SRC=$SRC"
echo "DEST=$DEST"

if hash md5 2>/dev/null; then
  WASMHASH=$(md5 $SRC/target/deploy/hellostdweb.wasm | cut -f4 -d' ')
else
  WASMHASH=$(md5sum $SRC/target/deploy/hellostdweb.wasm | cut -f1 -d' ')
fi

echo "WASMHASH=$WASMHASH"

WASMNAME="browser-$WASMHASH.wasm"
JSNAME="browser.js"
rm -f $DEST/*.js $DEST/*.wasm

if [ "$1" == "check" ] ; then
  cp $SRC/target/deploy/hellostdweb.wasm $DEST/$WASMNAME
else
  wasm-opt -Os $SRC/target/deploy/hellostdweb.wasm -o $DEST/$WASMNAME
fi
ls -lh $DEST/$WASMNAME
cp $SRC/target/deploy/hellostdweb.js $DEST/$JSNAME
sed -i -e "s~\"hellostdweb.wasm\"~\"/static/browser/$WASMNAME\"~g" $DEST/$JSNAME
