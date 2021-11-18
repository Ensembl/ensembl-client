/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from 'path';
import { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';

import { getPaths } from '../paths';
const paths = getPaths('production');

// production config, to be merged with the common config
export default (): Configuration => {
  return {
    mode: 'production',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /.*\.(gif|png|jpe?g)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]'
          },
          use: [
            // image loader should compress the images
            'image-webpack-loader'
          ]
        },

        {
          test: /static\/fonts\/.*\.(woff2?|eot|ttf|otf|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]'
          }
        }
      ]
    },
    plugins: [
      // plugin to extract css from the webpack javascript build files
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
      }),

      // copy static assets
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(
              paths.nodeModulesPath,
              'ensembl-genome-browser/browser*.wasm'
            ),
            to: path.join(paths.buildStaticPath, 'browser', '[name][ext]')
          },
          {
            from: path.join(paths.staticPath, 'favicons/*'),
            to: path.join(paths.buildStaticPath, 'favicons', '[name][ext]')
          },
          {
            from: path.join(paths.staticPath, 'robots.txt'),
            to: paths.buildPath
          }
        ]
      }),

      // compress static files 5kB and larger
      new CompressionPlugin({
        test: /.(js|css|html|wasm)$/,
        threshold: 5120,
        minRatio: 0.7
      }),

      new CompressionPlugin({
        test: /.(js|css|html|wasm)$/,
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        threshold: 5120,
        minRatio: 0.7
      }),

      // adds workbox library (from Google) support to enable service workers
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        exclude: [
          /index.html$/,
          /robots.txt$/,
          /\.gz$/,
          /\.br$/,
          /\.js\.map$/,
          /\.css\.map$/,
          /^.*favicons\/.*$/ // this is a roundabout way to exclude all files in the favicons folder; simple `/\/favicons\//` regex won't work
        ]
      })
    ],
    optimization: {
      // use terser plugin instead of uglify js to support minimisation for modern React.js features
      // also, optimise/minimise CSS files
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],

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
      },

      // module names are hashed into small numeric values
      moduleIds: 'deterministic'
    }
  };
};
