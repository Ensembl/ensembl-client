# 1. Build Setup

Date: 2018-08-28

## Status

Accepted

## Context

A build tool is necessary for various tasks such as compile, optimise and bundle the code.

## Decision

[Webpack](https://webpack.js.org) is used as the frontend build tool. There will be two separate configurations for development and production. The configuration will be written from scratch.

## Consequences

Webpack automates the main tasks necessary for development and production. There are many plugins available for Webpack, so configuring and customising it will not be too difficult.

The configuration is written from scratch (rather than using a pre-existing setup such as [create-react-app](https://github.com/wmonk/create-react-app-typescript)) to maintain flexibility and have more control over the build process.