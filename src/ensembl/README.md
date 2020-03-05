# Running the ensembl-client application

## Installation
1. Have Node.js installed on your computer — either directly from the [Node.js site](https://nodejs.org/), or through a Node version manager, such as [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n)
  NOTE: While the project may work with older versions of Node, it is developed and tested with the latest LTS version.
2. Run `npm install` to install the dependencies.

## NPM Scripts

### Basic commands
- `npm start` - Will start the development version of the project using `webpack` development server.
- `npm run build` – Will build production-ready (optimized and minified) version of the project
- `npm run storybook` - Starts the Storybook application

### Development and testing
- `npm run copy-dotenv` - Makes a copy of `.env.example` file named as `.env` in case it doesn't exist. This command will always run before `serve:dev`.
- `npm run serve:dev` - This does the same as `npm start`. The latter is actually an alias to this script.
- `npm run lint` - Runs both `lint:scripts` and `lint:style`.
- `npm run lint:scripts` - Runs ESLint against all typescript files to make sure they conform to the style guide.
- `npm run lint:styles` - Runs `stylelint` against SCSS files to make sure they conform to the style guide.
- `npm run check-types` – Runs typescript compiler to check for type correctness.
- `npm test` - Runs the suit of unit tests with `jest`.
- `npm test:watch` - Runs `jest` in watch mode.
- `npm run coverage` - Updates the `jest` coverage of the React.js code, and shows the test coverage.

### Testing production build locally
- `npm run prod:analyse` — Runs production build, and also uses `webpack-bundle-analyzer` to report the size of the bundle.
- `npm run serve:prod` - Runs the server that serves the production build locally over `http`.
- `npm run certify` - Runs `setup-ssl.js` to create a local SSL certificate to run the production build on `HTTPS`. There are two files that are created for this: `localhost.crt` and `localhost.key`.
- `npm run serve:prod:secure` - Runs the server that serves the production build locally over `https`. You will need to run `certify` before running this, in case you already haven't generated an SSL certificate.

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
