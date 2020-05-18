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
