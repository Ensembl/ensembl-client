# ensembl-client

## Introduction

This repository is an all-new frontend for the Ensembl website, written in React, Rust and WASM. The current public release can be seen at https://2020.ensembl.org. The new site will integrate genomes from across the taxonomic space, including vertebrates, invertebrates, plants, fungi and bacteria.

If you are interested in the latest developments in this project, please join our Slack channel #ensembl2020 or follow our [blog](https://www.ensembl.info).

## Installation

The Ensembl client runs on Node.js, and is managed using NPM and webpack. All supplementary libraries required for the genome browser (e.g. Rust) are included in this repository. To install and run ensembl-client:

1. Install Node.js if you don't have it already — either directly from the [Node.js site](https://nodejs.org/), or through a Node version manager, such as [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n). NOTE: While the project may work with older versions of Node, it is developed and tested with the latest LTS version.

2. Clone this repository

3. In a terminal, cd to `src/ensembl` and run `npm install`. This will install all the necessary NPM packages for app development and the build.

4. Run `npm start` to launch the application.

Further details on command-line options can be found in the application source code [README](/src/ensembl/README.md).

Detailed technical documentation (currently for the genome browser only) is available on our [GitHub Pages](https://ensembl.github.io/ensembl-client/).

In addition to the main web frontend, the codebase includes an installation of [Storybook](https://storybook.js.org/) which can be used to examine individual components. This can be run locally, or you can [view our current deployment of Storybook](https://ensembl.github.io/ensembl-client/storybook/index.html) on GitHub Pages.

## Site structure

The Ensembl client consists of a number of embedded React applications, each of which relies on one or more backend services to supply content. The following applications are currently in development:

### Genome Browser

The new genome browser uses Rust, WASM and WebGL to provide a fast, smooth interactive experience when viewing annotation in the context of an assembly. The browser can zoom in from the whole chromosome down to base-pair level, adjusting the display accordingly.

### Species Selector

Since we aim to include all the current Ensembl species in the finished site, easy selection of genomes is of paramount importance. Our Species Selector home page displays icons for our 42 most popular genomes, or you can search for any species by common or scientific name.

### Entity Viewer

View detailed information about annotation features: genes, transcripts, proteins, variants, etc.

### Custom Download

We are replacing BioMart with a more scalable and performant solution that allows you to quickly configure a custom dataset and download it. (Note that there will also be downloads of individual sequences available through other apps such as Entity Viewer.)

### Global Search

Similar to our current site-wide search, the Global Search will allow you to search for gene names and symbols and other identifiers.
