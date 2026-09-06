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
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

// Do not collect metrics from utility paths
const ignoredMetricPaths = new Set([HEALTHCHECK_URL_PATH, METRICS_URL_PATH]);

const getRouteTemplate = (req: Request) => {
  const fullPathname = req.baseUrl + req.path;
  const [first, second] = fullPathname.split('/');
  return [first, second].filter((part) => Boolean(part)).join('/');
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

  res.on('finish', () => {
    const route = getRouteTemplate(req);
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode)
    };

    httpRequestsTotal.inc(labels);
    endRequestTimer(labels);
  });

  next();
};

export default requestMetricsMiddleware;
