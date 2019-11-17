const webpack = require('webpack');
const path = require('path');
const webpackMerge = require("webpack-merge");

const loadPresets = require('./presets/loadPresets');

const commonConfig = require('./environments/webpack.common.js');

const getConfigForEnvironment = (env = { mode: 'dev' }) =>
  require(`./environments/webpack.config.${env.mode}`)(env);

const paths = require('./paths');

module.exports = env => {
  const { mode } = env || 'dev';

  return webpackMerge(
    commonConfig(env),
    getConfigForEnvironment(env),
    loadPresets(env)
  );
};
