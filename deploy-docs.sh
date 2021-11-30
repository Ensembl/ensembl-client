#!/bin/bash

# prepare directories
BUILD_DIR="built-docs"
if [ -d "$BUILD_DIR" ]; then rm -rf $BUILD_DIR; fi
mkdir -p "$BUILD_DIR" "$BUILD_DIR/storybook" "$BUILD_DIR/genome-browser"

# build storybook in respective folder
build-storybook -o "$BUILD_DIR/storybook"

# copy pre-built docs for genome browser in respective folder
cp -a ../assets/browser/app/doc/manual/site/. "$BUILD_DIR/genome-browser"

# copy landing page to the root docs build folder
cp static/html/docs-main.html "$BUILD_DIR/index.html"

# deploy the folder with built docs to github-pages
gh-pages -d "$BUILD_DIR"
