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

import webpack from 'webpack';

import getWebpackConfigs from '../webpack/getWebpackConfigs';

const build = async () => {
  const [webpackClientConfig, webpackServerConfig] = await getWebpackConfigs({
    dev: false
  });

  // the arguments of the callback function are error and webpack stats
  webpack([webpackClientConfig, webpackServerConfig], (err, stats) => {
    if (err) {
      // This branch will contain fatal webpack errors (wrong configuration, etc.)
      console.log('error!', err); // eslint-disable-line no-console
      process.exit(1);
    } else if (stats.hasErrors()) {
      // This branch will contain compilation errors (including typescript type checking errors from ForkTsCheckerPlugin)
      const info = stats.toJson();
      info.errors.forEach(({ file, message }) => {
        console.error('Error in', file); // eslint-disable-line no-console
        console.error(message); // eslint-disable-line no-console
      });
      process.exit(1);
    }
    console.log('The production build is ready'); // eslint-disable-line no-console
  });
};

build();
