// maybe try this? https://www.npmjs.com/package/nodemon-webpack-plugin

const nodeExternals = require('webpack-node-externals');

const { getPaths } = require('./paths');

const paths = getPaths('development');

module.exports = (env) => {
  return {
    mode: env.dev ? 'development' : 'production',
    target: 'node',
    entry: paths.serverEntryPath,
    output: {
      path: paths.buildServerPath,
      filename: 'server.js'
    },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss'],
    },
    externals: [nodeExternals()]
  };
}
