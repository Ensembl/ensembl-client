const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (isDev, moduleRules, plugins) => ({
  devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },
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
      ...moduleRules
    ]
  },
  output: {
    filename: isDev ? undefined : '[name].[contenthash].js',
    pathinfo: false,
    publicPath: '/'
  },
  plugins: [
    new ForkTsCheckerPlugin({
      tslint: true
    }),
    new HtmlPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../assets/html/template.html'),
      publicPath: '/'
    }),
    ...plugins
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
    alias: {
      assets: path.join(__dirname, '../assets')
    }
  }
});
