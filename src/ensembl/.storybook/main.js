const webpackConfig = require('./webpack');

module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  webpackFinal: (config) => webpackConfig(config),
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-notes'
    // '@storybook/addon-essentials'
  ]
}
