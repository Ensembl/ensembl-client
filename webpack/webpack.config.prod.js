const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const HtmlPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  devtool: 'source-map',
  entry: {
    index: path.join(__dirname, '../src/scripts/index.tsx')
  },
  mode: 'production',
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
          MiniCssExtractPlugin.loader,
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
              plugins: () => [
                postcssPresetEnv()
              ]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(svg|gif|png|jpe?g)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: true,
              name: '[path][name].[hash].[ext]'
            }
          },
          'image-webpack-loader'
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)/,
        loader: 'file-loader',
        options: {
          emitFile: true,
          name: '[path][name].[hash].[ext]'
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /node_modules/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  output: {
    filename: '[name].[contenthash].js',
    pathinfo: false,
    publicPath: '/'
  },
  performance: {
    hints: 'error'
  },
  plugins: [
    new ForkTsCheckerPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    new HtmlPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../assets/html/template.html'),
      publicPath: '/'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new BrotliPlugin({
      test: /.(js|css|html)$/,
      threshold: 10240, // 10kB
      minRatio: 0.8
    }),
    new ManifestPlugin(),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
    alias: {
      assets: path.join(__dirname, '../assets')
    }
  }
};