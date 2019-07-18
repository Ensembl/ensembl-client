import * as Sentry from '@sentry/browser';

import config from 'config';

interface ErrorServiceInterface {
  report: (error: Error) => void;
}

class ErrorService implements ErrorServiceInterface {
  public constructor() {
    this.initializeReportingService();
  }

  public report(error: Error) {
    if (config.isProduction) {
      Sentry.captureException(error);
    } else {
      console.log(error);
    }
  }

  private initializeReportingService() {
    Sentry.init({
      dsn: 'https://ab4205dce9c047588d30ddfaafd0655a@sentry.io/1507303'
    });
  }
}

export default new ErrorService();
