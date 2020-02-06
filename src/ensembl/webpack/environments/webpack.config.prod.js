const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');

const { getPaths } = require('../paths');
const paths = getPaths('production');


// copy from the environment the same variables that are declared in .env.example
// NOTE: if no environment variable with corresponding key is present, the value from .env.example will be used
const dotenv = require('dotenv').config({
  path: paths.envTemplatePath
});
const getEnvironmentVariables = () => Object.keys(dotenv.parsed).reduce((result, key) => ({
  ...result,
  [`process.env.${key}`]: JSON.stringify(process.env[key])
}), {});

// concatenate the common config with the prod config
module.exports = () => {
  return {
    mode: 'production',
    devtool: 'source-map',
    module: {
      rules: [
        // loader for images
        // image loader should compress the images
        // then file loader takes over to copy the images into the dist folder
        {
          test: /.*\.(gif|png|jpe?g)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                emitFile: true,
                name: '[name].[hash].[ext]',
                outputPath: 'images'
              }
            },
            'image-webpack-loader'
          ]
        },

        // loader for fonts that copies the fonts into the dist folder
        {
          test: /static\/fonts\/.*\.(woff2?|eot|ttf|otf|svg)$/i,
          loader: 'file-loader',
          options: {
            emitFile: true,
            name: '[path][name].[hash].[ext]'
          }
        }
      ]
    },
    plugins: [
      // make environment variables available on the client-side
      new webpack.DefinePlugin({
        ...getEnvironmentVariables()
      }),

      // plugin to extract css from the webpack javascript build files
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
      }),

      // copy static assets
      new CopyWebpackPlugin([
        {
          from: path.join(paths.nodeModulesPath, 'ensembl-genome-browser/browser*.wasm'),
          to: path.join(paths.buildStaticPath, 'browser'),
          flatten: true
        },
        {
          from: path.join(paths.staticPath, 'favicons/*'),
          to: path.join(paths.buildStaticPath, 'favicons'),
          flatten: true
        },
        {
          from: path.join(paths.staticPath, 'manifest.json'),
          to: paths.buildStaticPath,
          flatten: true
        }
      ]),

      // generate unique hashes for files based on the relative paths
      new webpack.HashedModuleIdsPlugin(),

      new CompressionPlugin({
        test: /.(js|css|html|wasm)$/,
        threshold: 5120,
        minRatio: 0.7
      }),

      // brotli compression for static files
      // only files above 5kB will be compressed
      new BrotliPlugin({
        test: /.(js|css|html|wasm)$/,
        threshold: 5120, // 5kB
        minRatio: 0.7
      }),

      // adds workbox library (from Google) support to enable service workers
      new WorkboxPlugin.GenerateSW({
        swDest: '../service-worker.js', // save service worker in the root folder (/dist) instead of /dist/static
        clientsClaim: true,
        skipWaiting: true,
        exclude: [/index.html$/, /\.gz$/, /\.br$/, /\.js\.map$/]
      }),

      new RobotstxtPlugin({
        filePath: '../robots.txt'
      })
    ],
    optimization: {
      // use terser plugin instead of uglify js to support minimisation for modern React.js features
      // optimize css assets plugin to minimise css as it is not yet supported in webpack by default
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ],

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
    }
  }

};
