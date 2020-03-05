# Running the ensembl-client application

## Build Scripts

### Basic commands
- `npm start` - This will start the development server via `webpack`. There is no need to do any compilation manually, as `webpack` will take care of it.
- `npm run storybook` - Starts the Storybook application

### Development and testing
- `npm run copy-dotenv` - Makes a copy of `.env.example` file named as `.env` in case it doesn't exist. This command will always run before `serve:dev`.
- `npm run serve:dev` - This does the same as `npm start`. The latter is actually an alias to this script.
- `npm run lint` - Runs both `lint:scripts` and `lint:style`. There is no need to run any of these lint scripts during development. This is because, each time a change is made to the code, the linters run along with the build.
- `npm run lint:scripts` - Runs ESLint to check code errors in TypeScript and React. Also, suggests improvements to the code.
- `npm run lint:styles` - Does the same as above through `stylelint` for the SASS code.
- `npm run check-types` – Runs typescript compiler to check for type correctness
- `npm jest` - Runs `jest`in non-verbose mode.
- `npm test` - Runs `jest` to check whether the unit tests pass in verbose mode.
- `npm test:watch` - Runs `jest` on watch mode.
- `npm run coverage` - Updates the `jest` coverage of the React.js code, and shows the test coverage.
- `npm run snapshot` - Updates the `jest` snapshots. You will sometimes need to run this after a change is made to the React.js code. However, first check whether the unit tests are passing after updating them. If you get any errors related to `jest` snapshots, you will then need to run this script.

### Production builds and deployment
- `npm run serve:prod` - This runs the built production site locally using `http`.
- `npm run serve:prod:secure` - Runs the build production site locally securely using `https`. You will need to run `certify` before running this, in case you already haven't generated an SSL certificate.
- `npm run deploy-docs` — Builds the Storybook application and deploys it, along with the docs on Genome browser, to Github Pages ([link](https://ensembl.github.io/ensembl-client))

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
