#! /bin/bash

set -ev

ASSET_REPO_NAME="throwaway-ensembl-static-assets"
ASSET_REPO="git@github.com:azangru/$ASSET_REPO_NAME.git"

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

if [ "$1" != "check" ] && hash wasm-opt 2>/dev/null ; then
  wasm-opt -Os $SRC/target/deploy/hellostdweb.wasm -o $DEST/$WASMNAME
else
  cp $SRC/target/deploy/hellostdweb.wasm $DEST/$WASMNAME
fi
ls -lh $DEST/$WASMNAME
cp $SRC/target/deploy/hellostdweb.js $DEST/$JSNAME

# Fix hash in destination js
sed -i -e "s~\"hellostdweb.wasm\"~\"/static/browser/$WASMNAME\"~g" $DEST/$JSNAME

# Send to remote repository
NOW=$(date +"%Y-%m-%d %H:%M")
USER=$(whoami)
BRANCH="$(git symbolic-ref HEAD 2>/dev/null)" || BRANCH="(anon. branch)"
BRANCH=${BRANCH##refs/heads/}
if [ "x$1" == "x" ] ; then
  echo "Sending to remote asset repo"
  GITDIR=$(mktemp -d)
  echo $GITDIR
  (
    cd $GITDIR
    git clone $ASSET_REPO
    cd $ASSET_REPO_NAME
    mkdir -p assets/$WASMHASH
    cp $SRC/target/deploy/hellostdweb.js assets/$WASMHASH/$JSNAME
    wasm-opt -Os $SRC/target/deploy/hellostdweb.wasm -o assets/$WASMHASH/$WASMNAME
    git rm browser.js *.wasm
    rm -f browser.js *.wasm
    ln -s assets/$WASMHASH/$WASMNAME $WASMNAME
    ln -s assets/$WASMHASH/$JSNAME $JSNAME
    sed -i -e "s~\s*\"files\":.*~  \"files\": [\"browser.js\",\"browser-$WASMHASH.wasm\"]~" package.json    
    git add assets/$WASMHASH $WASMNAME $JSNAME package.json
    git commit -m "$BRANCH at $NOW by $USER"
    git push
  )
  echo rm -rf $GITDIR
fi
