import React from 'react';
import faker from 'faker';
import { mount } from 'enzyme';

import apiService from 'src/services/api-service';
import useApiService from '../useApiService';
import { act } from 'react-dom/test-utils';

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

const TestingComponent = (props: { isAbortable?: boolean }) => {
  const params = {
    endpoint: mockEndpoint,
    isAbortable: props.isAbortable || false
  };
  const { data, error } = useApiService<{ message: string }>(params);

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
