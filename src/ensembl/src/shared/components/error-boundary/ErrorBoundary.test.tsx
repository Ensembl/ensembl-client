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

import React from 'react';
import { mount } from 'enzyme';

import errorService from 'src/services/error-service';

import ErrorBoundary from './ErrorBoundary';

const Child = () => <span>I am a child</span>;

const Fallback = ({ error }: { error: Error }) => (
  <span>I am the fallback component that received error {error}</span>
);

jest.spyOn(errorService, 'report');

describe('<ErrorBoundary />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders children components if they render normally', () => {
    const wrapper = mount(
      <ErrorBoundary fallbackComponent={Fallback}>
        <Child />
        <Child />
      </ErrorBoundary>
    );

    expect(wrapper.find(Child).length).toBe(2);
  });

  it('renders the fallback component if a child fails to render', () => {
    const wrapper = mount(
      <ErrorBoundary fallbackComponent={Fallback}>
        <Child />
        <Child />
      </ErrorBoundary>
    );
    const error = 'oops!';

    wrapper.find(Child).at(0).simulateError(error);

    expect(wrapper.find(Child).length).toBe(0);
    expect(wrapper.find(Fallback).length).toBe(1);
    expect(wrapper.find(Fallback).prop('error')).toBe(error);
  });

  it('calls errorService.report and passes the error to it', () => {
    const wrapper = mount(
      <ErrorBoundary fallbackComponent={Fallback}>
        <Child />
      </ErrorBoundary>
    );
    const error = 'oops!';

    wrapper.find(Child).at(0).simulateError(error);

    expect(errorService.report).toHaveBeenCalledWith(error);
  });
});
