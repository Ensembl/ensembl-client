// TODO: probably use Rollbar for error monitoring

interface ErrorServiceInterface {
  report: (error: Error) => void;
}

class ErrorService implements ErrorServiceInterface {
  public report(error: Error) {
    // TODO: actually report the errors somehow
    console.log('error', error);
  }
}

export default new ErrorService();
