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
import faker from 'faker';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

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
    return <div className="error">{error.message}</div>;
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
    const wrapper = mount(<TestingComponent />);
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 2);
      });
      wrapper.update();
    });

    expect(apiService.fetch).toHaveBeenCalledWith(mockEndpoint, {});
    expect(wrapper.find('.success').text()).toBe(mockSuccessData.message);
    expect(onAbort).not.toHaveBeenCalled();
  });

  it('does not fetch data if the `skip` option is set to true', async () => {
    const wrapper = mount(<TestingComponent skip={true} />);
    // waiting the same duration of time as in the test where the hook successfully fetches the data
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 2);
      });
      wrapper.update();
    });

    expect(apiService.fetch).not.toHaveBeenCalled();
    expect(wrapper.text()).toBe('Data not requested');
  });

  it('returns error if request errored out', async () => {
    jest.spyOn(apiService, 'fetch').mockImplementation(mockFailedFetch as any);
    const wrapper = mount(<TestingComponent />);
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1);
      });
      wrapper.update();
    });

    expect(wrapper.find('.success').length).toBe(0);
    expect(wrapper.find('.error').text()).toBe(mockErrorData.message);
  });

  it('aborts request on unmount if passed isAbortable option', () => {
    const wrapper = mount(<TestingComponent isAbortable={true} />);
    wrapper.unmount();

    expect(onAbort).toHaveBeenCalled();
  });
});
