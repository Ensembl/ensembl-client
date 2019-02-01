# 1. Build Setup

Date: 2018-08-28

## Status

Accepted

## Context

A build tool is necessary for various tasks such as compile, optimise and bundle the code.

## Decision

[Webpack](https://webpack.js.org) is used as the frontend build tool. There will be two separate configurations for development and production. The configuration will be written from scratch.

[Babel](https://babeljs.io/) is used along with Webpack for transpiling of TypeScript.

Linters are also used for TypeScript and SASS to enforce code best practices and detect potential issues. Also, `git` hooks are used through `npm` packages, `lint-staged` and `husky`, to do automated code formatting and linting.

## Consequences

Webpack automates the main tasks necessary for development and production. There are many plugins available for Webpack, so configuring and customising it will not be too difficult.

The configuration is written from scratch (rather than using a pre-existing setup such as [`create-react-app`](https://github.com/wmonk/create-react-app-typescript)) to maintain flexibility and have more control over the build process.

Typescript's compiler `tsc` and `ts-loader` have been replaced by Babel. The latter offers features such as, pollyfills and tree shaking which will be useful as the code scales.

Linters, along with their IDE extensions, will be useful to enforce a pre-selected stye guide.