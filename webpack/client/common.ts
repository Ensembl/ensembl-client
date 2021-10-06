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
import LoadablePlugin from '@loadable/webpack-plugin';

import { getPaths } from '../paths';

export default (env: Record<string, unknown>): Configuration => {
  const isDev = env.dev;
  const paths = getPaths();

  return {
    // the starting point of webpack bundling
    entry: {
      client: path.join(paths.rootPath, 'src/index.tsx'),
      browserSupport: path.join(
        paths.rootPath,
        'src/shared/helpers/browserSupport.ts'
      )
    },

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
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
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
          issuer: /\.scss$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]'
          }
        },

        // use file-loader on svg's (to be able to require them as a path to the image),
        // but also use @svgr/webpack to be able to require svg's directly as React components
        {
          test: /\.svg$/,
          issuer: { not: [/\.scss$/s] },
          use: ['@svgr/webpack', 'file-loader']
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

      new LoadablePlugin({
        writeToDisk: true
      }) as { apply(...args: any[]): void } // types workaround from https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50948#issuecomment-797664500
    ],

    // add aliases for more convenient imports
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss'],
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
