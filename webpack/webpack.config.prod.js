const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// loaders specific to prod
const moduleRules = [
  // loader for images
  // image loader should compress the images
  // then file loader takes over to copy the images into the dist folder
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

  // loader for fonts that copies the fonts into the dist folder
  {
    test: /assets\/fonts\/.*\.(woff2?|eot|ttf|otf|svg)$/i,
    loader: 'file-loader',
    options: {
      emitFile: true,
      name: '[path][name].[hash].[ext]'
    }
  }
];

// plugins specific to prod
const plugins = [
  // plugin to extract css from the webpack javascript build files
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css'
  }),

  // generate unique hashes for files based on the relative paths
  new webpack.HashedModuleIdsPlugin(),

  // brotli compression for static files
  // only files above 10kB will be compressed
  new BrotliPlugin({
    test: /.(js|css|html)$/,
    threshold: 10240, // 10kB
    minRatio: 0.8
  }),

  // generate an asset manifest file that maps real file names with their cache-ready equivalents
  new ManifestPlugin(),

  // adds workbox library (from Google) support to enable service workers
  new WorkboxPlugin.GenerateSW({
    clientsClaim: true,
    skipWaiting: true
  }),

  // analyse the file sizes of bundled files
  new BundleAnalyzerPlugin()
];

// prod specific configuration
const prodConfig = {
  optimization: {
    // create a separate webpack runtime chunk that will be used for all bundles
    runtimeChunk: true,

    // the common chunks configuration
    splitChunks: {
      cacheGroups: {
        // commonly shared code i.e. vendor code to be bundled as vendor.js
        commons: {
          test: /node_modules/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },

  // make webpack throw an error if one of the bundled file sizes is too large
  performance: {
    hints: 'error'
  }
};

// get the common config
const commonConfig = require('./webpack.common')(false, moduleRules, plugins);

// concatenate the common config with the prod config
module.exports = Object.assign({}, commonConfig, prodConfig);
