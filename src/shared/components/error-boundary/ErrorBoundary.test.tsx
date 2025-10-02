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

import { render } from '@testing-library/react';

import errorService from 'src/services/error-service';

import ErrorBoundary from './ErrorBoundary';

vi.mock('src/services/error-service');

const Child = () => <span className="child">I am a child</span>;
const BrokenChild = (props: { errorMessage: string }) => {
  throw new Error(props.errorMessage);

  return <div className="child">You shouldn't see me!</div>;
};

const Fallback = ({ error }: { error: Error }) => (
  <span className="fallback">
    I am the fallback component that received error {error.message}
  </span>
);

describe('<ErrorBoundary />', () => {
  // suppress error messages from React and jsdom
  // (see https://github.com/facebook/react/pull/13384)
  window.addEventListener('error', (e) => {
    e.preventDefault();
  });

  beforeAll(() => {
    errorService.report = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children components if they render normally', () => {
    const { container } = render(
      <ErrorBoundary fallbackComponent={Fallback}>
        <Child />
        <Child />
      </ErrorBoundary>
    );

    expect(container.querySelectorAll('.child').length).toBe(2);
  });

  it('renders the fallback component if a child fails to render', () => {
    const errorMessage = 'oops';
    const { container } = render(
      <ErrorBoundary fallbackComponent={Fallback}>
        <Child />
        <BrokenChild errorMessage={errorMessage} />
      </ErrorBoundary>
    );

    const fallbackComponent = container.querySelector('.fallback');

    expect(container.querySelectorAll('.child').length).toBe(0);
    expect(fallbackComponent).toBeTruthy();
    expect(fallbackComponent?.textContent).toMatch(errorMessage);
  });

  it('calls errorService.report and passes the error to it', () => {
    const errorMessage = 'oops';
    render(
      <ErrorBoundary fallbackComponent={Fallback}>
        <Child />
        <BrokenChild errorMessage={errorMessage} />
      </ErrorBoundary>
    );

    expect(errorService.report).toHaveBeenCalledTimes(1);
    const errorServiceReportCalls = (errorService.report as any).mock.calls;
    const error = errorServiceReportCalls[0][0];
    expect(error.message).toBe(errorMessage);
  });
});
