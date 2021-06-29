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

import express from 'express';

import devMiddleware from './middleware/devMiddleware';
import staticMiddleware from './middleware/staticMiddleware';
import viewsRouter from './routes/viewsRouter';

const app = express();

app.disable('x-powered-by'); // no need to announce to the world that we are running on Express

if (process.env.NODE_ENV === 'production') {
  app.use('/static', staticMiddleware);
} else {
  // in development, the contents of the static folder will be handled by webpack
  app.use(devMiddleware);
}

// All GET requests not covered by the middleware above will be handled by the viewsRouter
app.get('*', viewsRouter);

export default app;
