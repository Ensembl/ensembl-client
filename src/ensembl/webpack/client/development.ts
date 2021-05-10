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
import url from 'url';
import webpack, { Configuration } from 'webpack';
import dotenv from 'dotenv';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';

import { getPaths } from '../paths';
const paths = getPaths('development');

const dotenvConfig = dotenv.config();

// FIXME: remove
const devServerConfig = {
  onBeforeSetupMiddleware({ app }) {
    // use proper mime-type for wasm files
    app.get('*.wasm', function (req, res, next) {
      const options = {
        root: path.join(paths.nodeModulesPath, 'ensembl-genome-browser'),
        dotfiles: 'deny',
        headers: {
          'Content-Type': 'application/wasm'
        }
      };
      const parsedUrl = url.parse(req.url);
      const fileName = path.basename(parsedUrl.pathname);
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err);
        }
      });
    });
  },

  /**
   * Rules to proxy requests to the backend server in development.
   * The `context` field can be either a string or an array of strings for matching routes.
   * If you want to match just a subgroup of urls within a namespace,
   * you can add an exclusion rule to the array.
   * Example: { context: ['/api/**', '!/api/docs/**'] }
   * will match all routes in the `/api` namespace except for `/api/docs`.
   *
   * Notice that, according to the docs, the context array cannot contain a mix
   * of string paths and wildcard paths.
   * Valid examples:
   *  - only string paths: { context: '/foo' }, { context: ['/foo', '/bar'] }
   *  - only wildcard paths: { context: ['/api/**', '!/api/docs/**'] }
   * Invalid example:
   *  - mix of string and wildcard paths: { context: ['/api', '!/api/docs/**'] }
   */
  proxy: [
    {
      context: ['/api/**'],
      target: 'https://staging-2020.ensembl.org',
      changeOrigin: true,
      secure: false
    }
  ],

  // fallback for the history API used by the react router when page is reloaded
  // this should prevent 404 errors that usually occur in SPA on reloads
  historyApiFallback: true,

  // make the server accessible from other machines
  host: '0.0.0.0',

  // enable hot module reloading
  hot: true,

  static: [
    {
      directory: path.resolve(__dirname, '../..', 'static'),
      publicPath: '/static',
      serveIndex: true,
      watch: true
    }
  ]
};

// development config, to be merged with the common config
export default (): Configuration => ({
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      // this is the loader that will make webpack load file formats that are not supported by other loaders
      {
        test: /\.(woff|woff2|eot|ttf|otf|gif|png|jpe?g)$/,
        loader: 'file-loader',
        options: {
          // the file path and name that webpack will use to store these files
          name: `[path][name].[ext]`
        }
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
    }),

    // make environment variables available on the client-side
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenvConfig.parsed)
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
