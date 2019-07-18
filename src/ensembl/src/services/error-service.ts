import * as Sentry from '@sentry/browser';

import config from 'config';

interface ErrorServiceInterface {
  report: (error: Error) => void;
}

class ErrorService implements ErrorServiceInterface {
  private isReportingServiceInitialized: boolean = false;

  public constructor() {
    this.initializeReportingService();
  }

  public report(error: Error) {
    if (this.isReportingServiceInitialized) {
      Sentry.captureException(error);
    } else {
      console.log(error);
    }
  }

  private initializeReportingService() {
    if (config.isProduction) {
      Sentry.init({
        dsn: 'https://ab4205dce9c047588d30ddfaafd0655a@sentry.io/1507303'
      });
      this.isReportingServiceInitialized = true;
    }
  }
}

export default new ErrorService();
