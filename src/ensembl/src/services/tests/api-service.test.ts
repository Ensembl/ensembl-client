import apiService, { HTTPMethod } from '../api-service';
import config from 'config';

describe('api service', () => {
  let mockFetch;

  beforeEach(() => {
    const mockJsonResolver = jest.fn(() => Promise.resolve({ foo: 'foo' }));
    mockFetch = jest.fn(() =>
      Promise.resolve({
        json: mockJsonResolver
      })
    );
    jest
      .spyOn(apiService, 'getFetch')
      .mockImplementation(() => mockFetch as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('calls fetch passing it the endpoint', async () => {
    const endpoint = '/foo';
    await apiService.fetch(endpoint);

    expect(mockFetch).toHaveBeenCalled();

    const mockFetchCall: any[] = mockFetch.mock.calls[0];
    const [url] = mockFetchCall;

    expect(url).toEqual(`${config.apiHost}${endpoint}`);
  });

  test('passes options to fetch', async () => {
    const endpoint = '/foo';
    const options = {
      method: HTTPMethod.POST,
      body: JSON.stringify({ foo: 'bar' })
    };
    await apiService.fetch(endpoint, options);

    const mockFetchCall: any[] = mockFetch.mock.calls[0];
    const [_, passedOptions] = mockFetchCall;

    expect(passedOptions).toEqual(options);
  });

  test('uses GET by default', async () => {
    const endpoint = '/foo';
    await apiService.fetch(endpoint);

    const mockFetchCall: any[] = mockFetch.mock.calls[0];
    const [_, options] = mockFetchCall;

    expect(options.method).toEqual(`GET`);
  });
});
