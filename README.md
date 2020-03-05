# ensembl-client

## Introduction

Ensembl is an open-source, open-access bioinformatics project based at [EMBL-EBI](https://www.ebi.ac.uk) which creates, integrates and distributes genomic data and tools. The main entry point is our website, which provides visualisations of our genomic data as well as online tools for analysing your own data.

This repository is an all-new frontend for the Ensembl website, written in React, Rust and WASM. The current public release can be seen at https://2020.ensembl.org. The new site will integrate genomes from across the taxonomic space, including vertebrates, invertebrates, plants, fungi and bacteria.

## Architecture

The Ensembl client consists of a number of separate apps, each of which relies on one or more backend services to supply content. It is our intention that the Ensembl client code will be reusable in part or whole by other websites.

The following apps are currently in development:

* Genome Browser
* Species Selector
* Entity Viewer
* Custom Download
* Global Search

Additional apps will become available as the site expands.

Detailed technical documentation on these apps is under development on our [GitHub Pages](https://ensembl.github.io/ensembl-client/).

In addition to the main web frontend, the codebase includes an installation of [Storybook](https://storybook.js.org/) which can be used to examine individual components. This can be run locally, or you can [view our current deployment of Storybook](https://ensembl.github.io/ensembl-client/storybook/index.html) on GitHub Pages.

### Genome Browser

The new genome browser uses Rust, WASM and WebGL to provide a fast, smooth interactive experience when viewing annotation in the context of an assembly. The browser can zoom in from the whole chromosome down to base-pair level, adjusting the display accordingly.

### Species Selector

Since we aim to include all the current Ensembl species in the finished site, easy selection of genomes is of paramount importance. Our Species Selector home page displays icons for our 42 most popular genomes, or you can search for any species by common or scientific name.

### Entity Viewer

This is our app for viewing detailed information about annotation features: genes, transcripts, proteins, variants, etc.

### Custom Download

To replace BioMart, which is not compatible with our new code, we have created an interface which allows you to quickly configure a custom dataset and download it. (Note that there will also be downloads of individual sequences available through other apps such as Entity Viewer.)

### Global Search

Similar to our current site-wide search, the Global Search will give access to our genomic data.

## Installation

The Ensembl client runs on NodeJS - full instructions on how to install and run the application can be found in a separate README within the source directory src/ensembl.

## Community

If you are interested in the latest developments in this project, please join our Slack channel #ensembl2020 or follow our [blog](https://www.ensembl.info).
