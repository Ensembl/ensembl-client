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

import { Counter, Histogram } from '@prometheus-io/client';
import type { NextFunction, Request, Response } from 'express';

import { HEALTHCHECK_URL_PATH } from '../routes/healthcheckRouter';
import { METRICS_URL_PATH } from '../routes/metricsRouter';

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10]
});

// Do not collect metrics from utility paths
const ignoredMetricPaths = new Set([HEALTHCHECK_URL_PATH, METRICS_URL_PATH]);

const getRouteName = (req: Request) => {
  const fullPathname = req.baseUrl + req.path;
  const [, appPath] = fullPathname.split('/');
  return appPath || 'home';
};

const requestMetricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (ignoredMetricPaths.has(req.path)) {
    next();
    return;
  }

  const endRequestTimer = httpRequestDurationSeconds.startTimer();

  res.once('finish', () => {
    const commonLabels = {
      method: req.method,
      route: getRouteName(req)
    };

    httpRequestsTotal.inc({
      ...commonLabels,
      status_code: `${Math.floor(res.statusCode / 100)}xx`
    });

    endRequestTimer(commonLabels);
  });

  next();
};

export default requestMetricsMiddleware;
