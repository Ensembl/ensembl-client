const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const moduleRules = [
  {
    test: /assets\/img\/.*\.(svg|gif|png|jpe?g)$/i,
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
    test: /assets\/fonts\/.*\.(woff2?|eot|ttf|otf|svg)$/i,
    loader: 'file-loader',
    options: {
      emitFile: true,
      name: '[path][name].[hash].[ext]'
    }
  }
];

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css'
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
];

const prodConfig = {
  entry: {
    index: path.join(__dirname, '../src/scripts/index.tsx')
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
  performance: {
    hints: 'error'
  }
};

const commonConfig = require('./webpack.common')(false, moduleRules, plugins);

module.exports = Object.assign({}, commonConfig, prodConfig);
