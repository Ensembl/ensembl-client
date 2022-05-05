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
import faker from '@faker-js/faker';
import { render, screen } from '@testing-library/react';

import apiService from 'src/services/api-service';
import useApiService from '../useApiService';

import { LoadingState } from 'src/shared/types/loading-state';

const mockSuccessData = {
  message: 'success'
};

const mockErrorData = {
  message: 'error'
};

const onAbort = jest.fn();

const mockEndpoint = faker.internet.url();

const mockSuccessfulFetch = (
  _: string,
  { signal }: { signal: AbortSignal }
) => {
  signal && (signal.onabort = onAbort);
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSuccessData), 1);
  });
};

const mockFailedFetch = () => {
  return Promise.reject(mockErrorData);
};

type TestingComponentProps = {
  isAbortable?: boolean;
  skip?: boolean;
};

const TestingComponent = (props: TestingComponentProps) => {
  const params = {
    endpoint: mockEndpoint,
    ...props
  };
  const { loadingState, data, error } = useApiService<{ message: string }>(
    params
  );

  if (loadingState === LoadingState.NOT_REQUESTED) {
    return <div>Data not requested</div>;
  }

  if (data) {
    return <div className="success">{data.message}</div>;
  }

  if (error) {
    return <div className="error">{error.message as string}</div>;
  }

  return null;
};

describe('useApiService', () => {
  beforeEach(() => {
    jest
      .spyOn(apiService, 'fetch')
      .mockImplementation(mockSuccessfulFetch as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches data', async () => {
    render(<TestingComponent />);
    await screen.findByText(mockSuccessData.message); // would error if not found

    expect(apiService.fetch).toHaveBeenCalledWith(mockEndpoint, {});
    expect(onAbort).not.toHaveBeenCalled();
  });

  it('does not fetch data if the `skip` option is set to true', async () => {
    const { container } = render(<TestingComponent skip={true} />);

    // in this test, we are effectively proving a negative,
    // so just wait for a fraction of a second to afford useApiService the time
    // in which it would have called the fetch function had it not been prevented by the skip option
    await new Promise((resolve) => {
      setTimeout(resolve, 2);
    });

    expect(apiService.fetch).not.toHaveBeenCalled();
    expect(container.textContent).toBe('Data not requested');
  });

  it('returns error if request errored out', async () => {
    jest.spyOn(apiService, 'fetch').mockImplementation(mockFailedFetch);
    const { container } = render(<TestingComponent />);

    await screen.findByText(mockErrorData.message); // would error if not found

    expect(container.querySelector('.success')).toBeFalsy();
  });

  it('aborts request on unmount if passed isAbortable option', () => {
    const { unmount } = render(<TestingComponent isAbortable={true} />);
    unmount();

    expect(onAbort).toHaveBeenCalledTimes(1);
  });
});
