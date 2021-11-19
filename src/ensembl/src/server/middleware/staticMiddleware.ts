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

import express, { Response } from 'express';

import { getPaths } from 'webpackDir/paths';

const paths = getPaths();

const setCustomAssetsHeaders = (res: Response, path: string) => {
  if (path.endsWith('service-worker.js')) {
    // the header below allows a service worker to be served from a non-root directory,
    // yet to still be able to service all paths, starting from the root of the site
    res.setHeader('Service-Worker-Allowed', '/');
  }
};

// In the dev environment, static files requested from the /static folder
// will be served by Node using this middleware
const staticMiddleware = express.static(paths.buildStaticPath, {
  setHeaders: setCustomAssetsHeaders
});

export default staticMiddleware;
