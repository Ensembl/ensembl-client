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
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import getWebpackConfigs from '../webpack/getWebpackConfigs';

const analyze = async () => {
  const [webpackClientConfig] = await getWebpackConfigs({
    dev: false
  });

  webpackClientConfig.plugins.push(new BundleAnalyzerPlugin());

  // the arguments of the callback function are error and webpack stats
  webpack(webpackClientConfig, (err) => {
    if (err) {
      console.log('error!', err); // eslint-disable-line no-console
    }
    console.log('The production client build is ready'); // eslint-disable-line no-console
  });
};

analyze();
