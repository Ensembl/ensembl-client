# ensembl-client

## Introduction

This repository is an all-new frontend for the Ensembl website. The current public release can be seen at https://beta.ensembl.org. The new site will integrate genomes from across the taxonomic space, including vertebrates, invertebrates, plants, fungi and bacteria.

If you are interested in the latest developments in this project, please join our Slack channel #ensemblbeta or follow our [blog](https://www.ensembl.info).

## Installation

The Ensembl client runs on Node.js, and is managed using NPM and webpack. All supplementary libraries required for the genome browser (e.g. Rust) are included in this repository. To install and run ensembl-client:

1. Install Node.js if you don't have it already — either directly from the [Node.js site](https://nodejs.org/), or through a Node version manager, such as [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n). NOTE: While the project may work with older versions of Node, it is developed and tested with the latest LTS version.

2. Clone this repository

3. In a terminal, cd to `ensembl-client` and run `npm install`. This will install all the necessary NPM packages for app development and the build.

4. Run `npm start` to launch the application.

Detailed technical documentation (currently for the genome browser only) is available on our [GitHub Pages](https://ensembl.github.io/ensembl-client/).

In addition to the main web frontend, the codebase includes an installation of [Storybook](https://storybook.js.org/) which can be used to examine individual components. This can be run locally, or you can [view our current deployment of Storybook](https://ensembl.github.io/ensembl-client/storybook/index.html) on GitHub Pages.

## Site structure

The Ensembl client consists of a number of embedded React applications, each of which relies on one or more backend services to supply content. The following applications are currently in development:

### Genome Browser

The new genome browser uses Rust, WASM and WebGL to provide a fast, smooth interactive experience when viewing annotation in the context of an assembly. The browser can zoom in from the whole chromosome down to base-pair level, adjusting the display accordingly.

### Species Selector

Since we aim to include all the current Ensembl species in the finished site, easy selection of genomes is of paramount importance. Our Species Selector home page displays icons for our 42 most popular genomes, or you can search for any species by common or scientific name. 

### Entity Viewer

View detailed information about annotation features: genes, transcripts and proteins.

### Gene name Search

You can search for gene names from any of the applications above. Global Search, which will allow you to search for gene names and symbols and other identifiers, is for future development.

### BLAST

You can BLAST against a range of databases (proteins, transcripts, and genomic sequence), view the results in graphic and tabular format, and download the data.

# Running the ensembl-client application

## NPM Scripts

### Basic commands
- `npm start` - Will start the development version of the project using `webpack` development server.
- `npm run build` – Will build production-ready (optimized and minified) version of the project
- `npm run storybook` - Starts the Storybook application

### Development and testing
- `npm run lint` - Runs both `lint:scripts` and `lint:style`.
- `npm run lint:scripts` - Runs ESLint against all typescript files to make sure they conform to the style guide.
- `npm run lint:styles` - Runs `stylelint` against SCSS files to make sure they conform to the style guide.
- `npm run check-types` – Runs typescript compiler to check for type correctness.
- `npm test` - Runs the suite of unit tests with `jest`.
- `npm test:watch` - Runs `jest` in watch mode.
- `npm run coverage` - Updates the `jest` coverage of the React.js code, and shows the test coverage.

### Testing production build locally
- `npm run prod:analyse` — Runs production build, and also uses `webpack-bundle-analyzer` to report the size of the bundle.
- `npm run build` - Runs the server that serves the production build locally over `http`.

### Deployment (interal use only)
- `npm run deploy-docs` — Builds the Storybook application and deploys it, along with the docs for Genome browser, to Github Pages ([link](https://ensembl.github.io/ensembl-client))

## Development

Developers wishing to investigate or contribute to the ensembl-client codebase may also wish to install an IDE. We recommend VS Code, as it has great support for TypeScript and React.js.

### VS Code Extensions

The default setup of VS Code is sufficient for development, but its functionality can be extended further with these extensions:

- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens): Extends the existing support for `git`.
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Automated code formatting. Prettier is built into `webpack`, however it is not fit for formatting the code on the fly. It is currently disabled in `webpack`, so using this extension is recommended.
- [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss): The support for SCSS, the alternate syntax of SASS, is not great in VS Code. This extension adds this support.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Adds ESLint support to VS Code.
- [stylelint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint): Adds `stylelint` support to VS Code.
- [SVG Viewer](https://marketplace.visualstudio.com/items?itemName=cssho.vscode-svgviewer): By default, VS Code will show SVG images only as a code file. This extension will add functionality, to let you view the SVG files as images.
- [snapshot-tools](https://marketplace.visualstudio.com/items?itemName=asvetliakov.snapshot-tools): Enable linking of Jest generated snapshots with the Jest unit tests.
- [vscode-icons](https://marketplace.visualstudio.com/items?itemName=robertohuertasm.vscode-icons): By default, VS Code does not have icon support for many of the configuration files and formats used in the code. This extension adds those missing icons and more.
