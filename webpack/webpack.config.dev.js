const path = require('path');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

const moduleRules = [
  {
    test: /\.(woff|woff2|eot|ttf|otf|svg|gif|png|jpe?g)$/,
    loader: 'file-loader',
    options: {
      name: `[path][name].[ext]`
    }
  }
];

const plugins = [
  new StylelintWebpackPlugin({
    context: 'src',
    files: '**/*.scss'
  })
];

const devConfig = {
  entry: path.join(__dirname, '../src/scripts/index.tsx'),
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },
  serve: {
    add: (app) => {
      app.use(convert(history()));
    },
    devMiddleware: {
      stats: {
        assets: false,
        chunks: false,
        colors: true,
        modules: false
      }
    },
    open: true
  },
  watchOptions: {
    ignored: /node_modules/
  }
};

const commonConfig = require('./webpack.common')(true, moduleRules, plugins);

module.exports = Object.assign({}, commonConfig, devConfig);
