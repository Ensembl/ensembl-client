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

import * as Sentry from '@sentry/browser';

import config from 'config';

interface ErrorServiceInterface {
  report: (error: Error) => void;
}

class ErrorService implements ErrorServiceInterface {
  private isReportingServiceInitialized = false;

  public constructor() {
    this.initializeReportingService();
  }

  public report(error: Error) {
    if (this.isReportingServiceInitialized) {
      Sentry.captureException(error);
    } else {
      console.log(error); // eslint-disable-line no-console
    }
  }

  private initializeReportingService() {
    if (config.isProduction) {
      Sentry.init({
        dsn: 'https://ab4205dce9c047588d30ddfaafd0655a@sentry.io/1507303',
        ignoreErrors: [
          'ResizeObserver loop limit exceeded',
          'ResizeObserver loop completed with undelivered notifications',
          'AbortError'
        ]
      });
      this.isReportingServiceInitialized = true;
    }
  }
}

export default new ErrorService();
