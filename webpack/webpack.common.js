const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

// exports an anonymous function
// params are:
// 1. isDev: boolean - is it the development build that needs to be returned
// 2. moduleRules: array - all the module rules specific to the dev/prod build
// 3. plugins: array - all the plugins specific to the dev/prod build
// returns: webpack common configuration for the build
module.exports = (isDev, moduleRules, plugins) => ({
  // the source map type
  // for dev it will be a line by line source map
  // for prod it will be a generic source map that may not be as accurate as the former
  devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',

  // the starting point of webpack bundling
  entry: {
    index: path.join(__dirname, '../src/scripts/index.tsx')
  },

  // the mode is what notifies webpack how the build should be made
  mode: isDev ? 'development' : 'production',

  // the module loaders for webpack
  // these loaders help webpack to identify and process different file formats for bundling
  module: {
    rules: [
      // babel-loader is used for typescript as it has good tree shaking support compared to tsc
      {
        test: /.tsx?$/,
        loader: 'babel-loader'
      },

      // this will create source maps for the typescript code
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },

      // the loaders for styling
      // a scss file will first be loaded via sass loader and transpiled
      // afterwards it will be processed by postcss loader to make the css cross-browser compatility
      // add the processed css into the html document during runtime for dev
      // and extract the css for prod and minify it as external stylesheets
      {
        test: /.scss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [postcssPresetEnv()]
            }
          },
          'sass-loader'
        ]
      },

      // loaders specific to dev/prod
      ...moduleRules
    ]
  },

  // this is the config to define how the output files needs to be
  output: {
    // dev will take the default file names as no physical files are emitted
    // prod will have emitted files and will include the content hash, which will change every time the contents of the js file changes.
    filename: isDev ? undefined : '[name].[contenthash].js',

    // stop webpack from adding additional comments/info to generated bundles as it is a performance hit (slows down build times)
    pathinfo: false,

    // prepend the public path as the root path to all the files that are inserted into the index file
    publicPath: '/'
  },

  // the plugins that extends the webpack configuration
  plugins: [
    // checks typescript types and runs tslint in a separate process
    new ForkTsCheckerPlugin({
      tslint: true
    }),

    // generates the index file using the provided html template
    new HtmlPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../assets/html/template.html'),
      publicPath: '/'
    }),

    // plugins specific to dev/prod
    ...plugins
  ],

  // configuration that allows us to not to use file extensions and shorten import paths (using aliases)
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
    alias: {
      assets: path.join(__dirname, '../assets')
    }
  }
});
