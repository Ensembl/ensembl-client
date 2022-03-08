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
import nodeExternals from 'webpack-node-externals';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import { getPaths } from '../paths';

export default (): Configuration => {
  const paths = getPaths();

  return {
    // server-side entry point
    entry: {
      server: path.join(paths.rootPath, 'src/server/index.ts')
    },
    target: 'node',

    module: {
      rules: [
        {
          test: /.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },

        // the loaders for styling
        // a scss file will first be loaded via sass loader and transpiled
        // afterwards it will be processed by postcss loader to make the css cross-browser compatible
        // add the processed css into the html document during runtime for dev
        // and extract the css for prod and minify it as external stylesheets
        {
          test: /.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit: false
              }
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                modules: {
                  localIdentName: '[local]__[name]__[hash:base64:5]'
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
            },
            'sass-loader'
          ]
        },

        {
          test: /\.svg$/i,
          oneOf: [
            {
              issuer: /\.scss$/,
              type: 'asset/resource',
              generator: {
                filename: 'images/[name].[hash][ext]',
                publicPath: '/static/',
                emit: false
              }
            },
            {
              resourceQuery: /url/, // will match all imports that end in `.svg?url`
              type: 'asset/resource',
              generator: {
                filename: 'images/[name].[hash][ext]',
                publicPath: '/static/',
                emit: false
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
      path: paths.buildServerDir,
      filename: '[name].js'
    },

    // the plugins that extends the webpack configuration
    plugins: [
      // checks typescript types
      new ForkTsCheckerPlugin(),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(paths.rootPath, 'src/server/views'),
            to: path.join(paths.buildServerDir, 'views')
          }
        ]
      })
    ],

    // add aliases for more convenient imports
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss'],
      alias: {
        ensemblRoot: path.join(paths.rootPath),
        config: path.join(paths.rootPath, 'config.ts'),
        src: path.join(paths.rootPath, 'src'),
        tests: path.join(paths.rootPath, 'tests'),
        static: path.join(paths.rootPath, 'static'),
        webpackDir: path.join(paths.rootPath, 'webpack'),
        fs: false,
        path: false
      }
    },

    // ignore node_modules when bundling for the server
    externals: [
      nodeExternals({
        allowlist: ['@ensembl/ensembl-genome-browser']
      })
    ]
  };
};
