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
import webpack, { Configuration } from 'webpack';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';

import { getPaths } from '../paths';
const paths = getPaths('development');

// development config, to be merged with the common config
export default (): Configuration => ({
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      // this is the loader that will make webpack load file formats that are not supported by other loaders
      {
        test: /\.(woff|woff2|eot|ttf|otf|gif|png|jpe?g)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    // enable hot module replacement
    new webpack.HotModuleReplacementPlugin(),

    // lint SASS files
    new StylelintWebpackPlugin({
      context: path.join(paths.rootPath, 'src'),
      files: '**/*.scss'
    })
  ],
  // speed up build times for dev
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },
  // watch ensembl-genome-browser in the node_modules folder; but prevent watching for other modules
  // (this should reduce memory consumption and also should improve build times)
  watchOptions: {
    ignored: /node_modules([\\]+|\/)+(?!ensembl-genome-browser)/
  }
});
