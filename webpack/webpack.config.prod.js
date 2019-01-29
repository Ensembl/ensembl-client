const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const RobotstxtPlugin = require("robotstxt-webpack-plugin").default;
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
let plugins = [
  // plugin to extract css from the webpack javascript build files
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css'
  }),

  // copy the browser assets into the production dist/ directory
  // this is only temporarily until a better solution is found
  new CopyWebpackPlugin([
    {
      from: path.join(__dirname, '../assets/browser'),
      to: path.join(__dirname, '../dist/assets/browser')
    }
  ]),

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

  new RobotstxtPlugin(),
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
module.exports = env => {
  if(!env || !env.RUN_FROM_SCRIPT) {
    // Only these if NOT run from a script
    // analyse the file sizes of bundled files
    commonConfig.plugins.push(new BundleAnalyzerPlugin());
  }
  return Object.assign({}, commonConfig, prodConfig);
}
