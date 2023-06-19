import webpackConfig from './webpack';

export default {
  stories: ['../stories/**/*.stories.tsx'],
  webpackFinal: config => webpackConfig(config),
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  }
};
