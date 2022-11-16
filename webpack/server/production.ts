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

import { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// production config, to be merged with the common config
export default (): Configuration => {
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
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[contenthash][ext]',
            publicPath: '/static/',
            emit: false
          }
        },

        // loader for fonts that copies the fonts into the dist folder
        {
          test: /static\/fonts\/.*\.(woff2?|eot|ttf|otf|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash][ext]',
            publicPath: '/static/',
            emit: false
          }
        }
      ]
    },
    plugins: [
      // plugin to extract css from the webpack javascript build files
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
      })
    ],
    optimization: {
      // no need to minimize server-side code
      minimize: false,

      // create a separate webpack runtime chunk that will be used for all bundles
      runtimeChunk: true,

      // module names are hashed into small numeric values
      moduleIds: 'deterministic'
    }
  };
};
