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

import { Router } from 'express';
import { collectDefaultMetrics, register } from '@prometheus-io/client';

let defaultMetricsInitialized = false;

if (!defaultMetricsInitialized) {
  collectDefaultMetrics({ register });
  defaultMetricsInitialized = true;
}

const router = Router();

export const METRICS_URL_PATH = '/metrics';

router.get(METRICS_URL_PATH, async (_req, res, next) => {
  try {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  } catch (error) {
    next(error);
  }
});

export default router;
