const { merge: webpackMerge } = require('webpack-merge');

const commonConfig = require('./environments/webpack.common.js');

const getConfigForEnvironment = (env = { dev: true }) => {
  const mode = env.dev ? 'dev' : 'prod';
  return require(`./environments/webpack.config.${mode}`)(env);
}

module.exports = env => {
  return webpackMerge(
    commonConfig(env),
    getConfigForEnvironment(env),
  );
};
