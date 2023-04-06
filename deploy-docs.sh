#!/bin/bash

# prepare directories
BUILD_DIR="built-docs"
if [ -d "$BUILD_DIR" ]; then rm -rf $BUILD_DIR; fi
mkdir -p "$BUILD_DIR" "$BUILD_DIR/storybook"

# build storybook in respective folder
storybook build -o "$BUILD_DIR/storybook"

# copy landing page to the root docs build folder
cp static/html/docs-main.html "$BUILD_DIR/index.html"

# deploy the folder with built docs to github-pages
gh-pages -d "$BUILD_DIR"
