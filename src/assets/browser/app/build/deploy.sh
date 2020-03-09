#! /bin/bash

set -ev

ASSET_REPO_NAME="ensembl-genome-browser-assets"
ASSET_REPO="git@github.com:Ensembl/$ASSET_REPO_NAME.git"
RAW_ASSET_BASE="https://raw.githubusercontent.com/Ensembl/$ASSET_REPO_NAME/master"

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
  export RUSTFLAGS="--cfg=deploy --cfg=console"
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
  echo "Making tarball"
  TARDIR=$(mktemp -d)
  (
    set -ev
    cd $TARDIR
    mkdir package
    cd package
    wasm-opt -Os $SRC/target/deploy/hellostdweb.wasm -o $WASMNAME
    cp $SRC/target/deploy/hellostdweb.js $JSNAME
    cp $SRC/build/package.json package.json
    cd ..
    tar -c -z -f assets-$WASMHASH.tar.gz package
    cp assets-$WASMHASH.tar.gz /tmp
  )
  echo "Sending to remote asset repo"
  GITDIR=$(mktemp -d)
  echo $GITDIR
  (
    set -ev
    cd $GITDIR
    git clone $ASSET_REPO
    cd $ASSET_REPO_NAME
    cp $TARDIR/assets-$WASMHASH.tar.gz .
    git add assets-$WASMHASH.tar.gz
    git commit -m "$BRANCH at $NOW"
    git push
  )
  rm -rf $GITDIR $TARDIR $MODDIR
  RAW_URL="$RAW_ASSET_BASE/assets-$WASMHASH.tar.gz"
  (
    set -ev
    cd "$SRC/../../../ensembl"
    sed -i -e "s~.*ensembl-genome-browser.*~    \"ensembl-genome-browser\": \"$RAW_URL\",~" package.json
    npm install || true
    2>&1 echo
    (git diff package-lock.json | grep '^[+-]' | grep -v ensembl-genome-browser-assets | grep -v -- --- | grep -v +++ | grep -v '"integrity":') && ( 2>&1 echo "ERROR! package lock did not update cleanly, aborting" && exit 1 )
  ) || exit 1
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

