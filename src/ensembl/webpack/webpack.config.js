const { merge: webpackMerge } = require('webpack-merge');

const loadPresets = require('./presets/loadPresets');

const commonConfig = require('./environments/webpack.common.js');

const getConfigForEnvironment = (env = { mode: 'dev' }) =>
  require(`./environments/webpack.config.${env.mode}`)(env);

module.exports = env => {
  return webpackMerge(
    commonConfig(env),
    getConfigForEnvironment(env),
    loadPresets(env)
  );
};
