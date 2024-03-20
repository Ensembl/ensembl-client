import webpackConfig from './webpack';

export default {
  stories: ['../stories/**/*.stories.tsx'],
  webpackFinal: config => webpackConfig(config),
  addons: ['@storybook/addon-essentials', '@storybook/addon-webpack5-compiler-babel'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  }
};
