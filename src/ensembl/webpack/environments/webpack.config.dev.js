const dotenv = require('dotenv').config();

const webpack = require('webpack');
const path = require('path');
const url = require('url');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

const { getPaths } = require('../paths');
const paths = getPaths('development');

const devServerConfig = {
  before(app) {
    // use proper mime-type for wasm files
    app.get('*.wasm', function(req, res, next) {
      const options = {
        root: path.join(paths.nodeModulesPath, 'ensembl-genome-browser'),
        dotfiles: 'deny',
        headers: {
          'Content-Type': 'application/wasm'
        }
      };
      const parsedUrl = url.parse(req.url);
      const fileName = path.basename(parsedUrl.pathname);
      res.sendFile(fileName, options, function(err) {
        if (err) {
          next(err);
        }
      });
    });
  },

  // rules to proxy requests to the backend server in development
  proxy: {
    '/api': {
      target: 'http://api-prefix.review.ensembl.org',
      changeOrigin: true,
      secure: false
    }
  },

  // fallback for the history API used by the react router when page is reloaded
  // this should prevent 404 errors that usually occur in SPA on reloads
  historyApiFallback: true,

  // make the server accessible from other machines
  host: '0.0.0.0',

  // enable hot module reloading
  hot: true,

  // configuration to customise what is displayed in the console by webpack
  stats: {
    assets: false,
    chunks: false,
    colors: true,
    modules: false
  }
};


// concatenate the common config with the dev config
module.exports = () => ({
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      // this is the loader that will make webpack load file formats that are not supported by other loaders
      {
        test: /\.(woff|woff2|eot|ttf|otf|gif|png|jpe?g)$/,
        loader: 'file-loader',
        options: {
          // the file path and name that webpack will use to store these files
          name: `[path][name].[ext]`
        }
      }
    ]
  },
  plugins: [
    // this plugin is required to enable hot module reloading
    // for the webpack dev server
    new webpack.HotModuleReplacementPlugin(),

    // lint the SASS files within the Ensembl codebase only
    new StylelintWebpackPlugin({
      context: path.join(paths.rootPath, 'src'),
      files: '**/*.scss'
    }),

    // make environment variables available on the client-side
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed)
    })
  ],
  // speed up build times for dev
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },
  // disable webpack from watching node modules (except for ensembl-genome-browser)
  // this would reduce memory consumption and also should improve build times
  watchOptions: {
    ignored: /node_modules([\\]+|\/)+(?!ensembl-genome-browser)/
  },
  devServer: devServerConfig
});
