const webpackConfig = require('./webpack');

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ['../stories/**/*.stories.tsx'],
  webpackFinal: (config) => webpackConfig(config),
  addons: [
    '@storybook/addon-essentials'
  ]
}
