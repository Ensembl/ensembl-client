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
import { ProgressPlugin, Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

import { getPaths } from '../paths';
import { buildClassName } from '../utils/cssModules';

export default (env: Record<string, unknown>): Configuration => {
  const isDev = env.dev;
  const paths = getPaths();

  return {
    // the starting point of webpack bundling
    entry: {
      client: path.join(paths.rootPath, 'src/index.tsx'),
      unsupportedBrowser: path.join(
        paths.rootPath,
        'src/content/unsupported-browser/index.tsx'
      )
    },

    module: {
      rules: [
        {
          test: /.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },

        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: {
                  auto: true, // will match all files with a pattern /\.module\.\w+$/
                  localIdentName: '[local]__[name]__[hash:base64:5]',
                  getLocalIdent: buildClassName,
                  namedExport: false, // since v 7.0 it is true by default, should we refactor our code to "import * as styles ..."?
                  exportLocalsConvention: 'as-is' // consequence of using `namedExport: false` (the loader in this mode also camel-cases css class names). If namedExports were true, this field wouldn't have been needed
                }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['postcss-preset-env']]
                }
              }
            }
          ]
        },

        {
          test: /\.svg$/i,
          oneOf: [
            {
              issuer: /\.css$/,
              type: 'asset/resource',
              generator: {
                filename: 'images/[name].[hash][ext]'
              }
            },
            {
              resourceQuery: /url/, // will match all imports that end in `.svg?url`
              type: 'asset/resource',
              generator: {
                filename: 'images/[name].[hash][ext]'
              }
            },
            {
              issuer: /\.[jt]sx?$/,
              use: ['@svgr/webpack']
            }
          ]
        }
      ]
    },

    // this is the config to define how the output files needs to be
    output: {
      // dev will take the default file names as no physical files are emitted
      // prod will have emitted files and will include the content hash, which will change every time the contents of the js file changes.
      filename: isDev ? '[name].js' : '[name].[contenthash].js',

      path: paths.buildStaticPath,

      // prepend the public path as the root path to all the files that are inserted into the index file
      publicPath: '/static/'
    },

    plugins: [
      // checks typescript types
      new ForkTsCheckerPlugin(),

      new ProgressPlugin(),

      new WebpackManifestPlugin({
        writeToFileEmit: true
      })
    ],

    // add aliases for more convenient imports
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        config: path.join(paths.rootPath, 'config.ts'),
        src: path.join(paths.rootPath, 'src'),
        tests: path.join(paths.rootPath, 'tests'),
        static: path.join(paths.rootPath, 'static'),
        webpackDir: path.join(paths.rootPath, 'webpack'),
        fs: false,
        path: false
      }
    }
  };
};
