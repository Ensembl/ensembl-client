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

import webpack, { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import dotenv from 'dotenv';

import { getPaths } from '../paths';
const paths = getPaths('production');

// copy from the environment the same variables that are declared in .env.example
// NOTE: if no environment variable with corresponding key is present, the value from .env.example will be used
const dotenvConfig = dotenv.config({
  path: paths.envTemplatePath
});
const getEnvironmentVariables = () =>
  Object.keys(dotenvConfig.parsed).reduce(
    (result, key) => ({
      ...result,
      [`process.env.${key}`]: JSON.stringify(process.env[key])
    }),
    {}
  );

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
