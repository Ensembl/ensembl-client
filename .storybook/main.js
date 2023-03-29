const webpackConfig = require('./webpack');
module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  webpackFinal: config => webpackConfig(config),
  features: {
    babelModeV7: true
  },
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  }
};