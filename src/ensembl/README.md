# Ensembl 2020 Frontend

## Setup

The tools that need setting up are Node.js and the IDE. To setup Node.js you only need to run `npm install`. This will install all the necessary NPM packages for app development and the build.

### Build Scripts

There are several script commands that have been baked into the NPM configuration. They have been briefly described below:

1. `npm start` - This should start the development server via `webpack`. There is no need to do any compilation manually, as `webpack` will take care of it.
2. `npm run serve:dev` - This does the same as `npm start`. The latter is actually an alias to this script.
3. `npm run build` - Runs the production build. It will initially delete the existing local production build and replace it with the new one.
4. `npm run serve:prod` - This runs the built production site locally.
5. `npm run lint:scripts` - Runs TSLint to check code errors in TypeScript and React. Also, suggests improvements to the code.
6. `npm run lint:style` - Does the same as above through `stylelint` for the SASS code.
7. `npm run lint` - Runs both `lint:scripts` and `lint:style`. There is no need to run any of these lint scripts during development. This is because, each time a change is made to the code, the linters run along with the build.
8. `npm test` - Runs `jest` to check whether the unit tests pass.
9. `npm run coverage` - Updates the `jest` coverage of the React.js code, and shows the test coverage.
10. `npm run shanpshot` - Updates the `jest` snapshots. You will sometimes need to run this after a change is made to the React.js code. However, first check whether the unit tests are passing after updating them. If you get any errors related to `jest` snapshots, you will then need to run this script.
11. `npm run storybook` - Starts the Storybook application
12. `npm run deploy-storybook` — Builds the Storybook application and deploys it to Github Pages ([link](https://ensembl.github.io/ensembl-client))
12. `npm run check-types` – Runs typescript compiler to check for type correctness

### IDE Setup

The IDE setup may change depending on which one you have chosen. This document will describe setting VS Code for development. The default setup of VS Code is sufficient for development, as it has great support for TypeScript and React.js. However, its functionality can be extended further with these VS Code extensions:

1. [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens): Extends the existing support for `git`.
2. [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Automated code formatting. Prettier is built into `webpack`, however it is not fit for formatting the code on the fly. It is currently disabled in `webpack`, so using this extension is recommended.
3. [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss): The support for SCSS, the alternate syntax of SASS, is not great in VS Code. This extension adds this support.
4. [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint): Adds TSLint support to VS Code.
5. [stylelint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint): Adds `stylelint` support to VS Code.
6. [SVG Viewer](https://marketplace.visualstudio.com/items?itemName=cssho.vscode-svgviewer): By default, VS Code will show SVG images only as a code file. This extension will add functionality, to let you view the SVG files as images.
7. [snapshot-tools](https://marketplace.visualstudio.com/items?itemName=asvetliakov.snapshot-tools): Enable linking of Jest generated snapshots with the Jest unit tests.
8. [vscode-icons](https://marketplace.visualstudio.com/items?itemName=robertohuertasm.vscode-icons): By default, VS Code does not have icon support for many of the configuration files and formats used in the code. This extension adds those missing icons and more.
