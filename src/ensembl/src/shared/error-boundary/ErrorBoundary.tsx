import React, { PureComponent } from 'react';

import errorService from 'src/services/error-service';

type Props = {
  fallback: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends PureComponent<Props, State> {
  public state = {
    hasError: false
  };

  private errorService = errorService;

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(error: Error) {
    this.errorService.report(error);
  }

  public render() {
    return this.state.hasError ? (
      this.props.fallback
    ) : (
      <>{this.props.children}</>
    );
  }
}

export default ErrorBoundary;
