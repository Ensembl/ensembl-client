#! /bin/bash

set -ev

ASSET_REPO_NAME="throwaway-ensembl-static-assets"
ASSET_REPO="git@github.com:azangru/$ASSET_REPO_NAME.git"
NPM_ASSET_REPO="git://github.com/azangru/$ASSET_REPO_NAME.git"

# Where is this script running?
pushd $(dirname "${0}") > /dev/null
BASE=$(pwd -L)
popd > /dev/null

# Source and destination directories
SRC="$BASE/.."
DEST="$BASE/../../../../ensembl/static/browser"
cd $SRC
echo "SRC=$SRC"
echo "DEST=$DEST"

# What compile flags are needed?
touch Cargo.lock # force build
if [ "$1" == "check" ] ; then
  export RUSTFLAGS="--cfg=deploy --cfg=console -A warnings"
else
  export RUSTFLAGS="--cfg=deploy"
fi

# Compile
cargo +nightly web build --target=wasm32-unknown-unknown --release
cargo +nightly web deploy --target=wasm32-unknown-unknown --release

# Compute WASMHASH
if hash md5 2>/dev/null; then
  WASMHASH=$(md5 $SRC/target/deploy/hellostdweb.wasm | cut -f4 -d' ')
else
  WASMHASH=$(md5sum $SRC/target/deploy/hellostdweb.wasm | cut -f1 -d' ')
fi
echo "WASMHASH=$WASMHASH"

# Update files and copy/optimise into place
WASMNAME="browser-$WASMHASH.wasm"
JSNAME="browser.js"
rm -f $DEST/*.js $DEST/*.wasm

# Fix hash in js
sed -i -e "s~\"hellostdweb.wasm\"~\"/static/browser/$WASMNAME\"~g" $SRC/target/deploy/hellostdweb.js

# Send to remote repository
NOW=$(date +"%Y-%m-%d %H:%M")
BRANCH="$(git symbolic-ref HEAD 2>/dev/null)" || BRANCH="(anon. branch)"
BRANCH=${BRANCH##refs/heads/}
MODDIR="$SRC/../../../ensembl/node_modules/ensembl-genome-browser"
if [ "x$1" == "x" ] ; then
  if hash wasm-opt 2>/dev/null ; then
    echo "Found wasm-opt: good"
  else
    echo "Refusing to deploy unoptimised WASM"
    exit 1
  fi
  echo "Sending to remote asset repo"
  GITDIR=$(mktemp -d)
  echo $GITDIR
  (
    set -v
    cd $GITDIR
    git clone $ASSET_REPO
    cd $ASSET_REPO_NAME
    git rm browser.js *.wasm
    rm -f browser.js *.wasm
    cp $SRC/target/deploy/hellostdweb.js $JSNAME
    wasm-opt -Os $SRC/target/deploy/hellostdweb.wasm -o $WASMNAME
    git add $WASMNAME $JSNAME package.json
    git commit -m "$BRANCH at $NOW"
    git push
    git tag -a "wasm/$WASMHASH" -m "$BRANCH at $NOW"
    git push origin tag "wasm/$WASMHASH"
    sed -i -e "s~.*ensembl-genome-browser.*~    \"ensembl-genome-browser\": \"$NPM_ASSET_REPO#wasm/$WASMHASH\",~" $SRC/../../../ensembl/package.json
    rm -rf $MODDIR
  )
  echo rm -rf $GITDIR
elif [ "x$1" == "xstrip" ] ; then
  rm -f $MODDIR/browser.js $MODDIR/browser-*.wasm
  if hash wasm-opt 2>/dev/null ; then
    wasm-opt -Os $SRC/target/deploy/hellostdweb.wasm -o $MODDIR/$WASMNAME
  else
    cp $SRC/target/deploy/hellostdweb.wasm $MODDIR/$WASMNAME
  fi
  cp $SRC/target/deploy/hellostdweb.js $MODDIR/$JSNAME
elif [ "x$1" == "xcheck" ] ; then
  rm -f $MODDIR/browser.js $MODDIR/browser-*.wasm
  cp $SRC/target/deploy/hellostdweb.wasm $MODDIR/$WASMNAME
  cp $SRC/target/deploy/hellostdweb.js $MODDIR/$JSNAME
fi

