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

import { PureComponent, type ComponentType, type ReactNode } from 'react';

import errorService from 'src/services/error-service';

type FallbackComponentProps = {
  error: Error;
};

type Props = {
  fallbackComponent: ComponentType<FallbackComponentProps>;
  children: ReactNode;
};

type State = {
  error: Error | null;
};

class ErrorBoundary extends PureComponent<Props, State> {
  public state = {
    error: null
  };

  private errorService = errorService;

  public static getDerivedStateFromError(error: Error) {
    return { error };
  }

  public componentDidCatch(error: Error) {
    this.errorService.report(error);
  }

  public render() {
    const FallbackComponent = this.props.fallbackComponent;
    const error: Error | null = this.state.error;

    return error ? (
      <FallbackComponent error={error} />
    ) : (
      <>{this.props.children}</>
    );
  }
}

export default ErrorBoundary;
