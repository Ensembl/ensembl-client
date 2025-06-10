import webpackConfig from './webpack';

export default {
  stories: ['../stories/**/*.stories.tsx'],
  webpackFinal: config => webpackConfig(config),
  addons: ['@storybook/addon-webpack5-compiler-babel'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  // Storybook 8 changed the default component analysis tool from react-docgen-typescript to react-docgen.
  // This has caused problems with the building of our stories; so the `typescript` below opts out of this change.
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  }
};
