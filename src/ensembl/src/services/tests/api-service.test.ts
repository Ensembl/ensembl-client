import apiService, { HTTPMethod } from '../api-service';
import config from 'config';

describe('api service', () => {
  let mockFetch: any;
  let mockResponse = { foo: 'foo' };
  let mockTextResponse = 'hello world';

  beforeEach(() => {
    const mockJsonResolver = jest.fn(() => Promise.resolve(mockResponse));
    const mockTextResolver = jest.fn(() => Promise.resolve(mockTextResponse));
    mockFetch = jest.fn(() =>
      Promise.resolve({
        json: mockJsonResolver,
        text: mockTextResolver
      })
    );
    jest
      .spyOn(apiService, 'getFetch')
      .mockImplementation(() => mockFetch as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('.fetch', () => {
    const endpoint = '/foo';

    test('calls fetch passing it the endpoint', async () => {
      await apiService.fetch(endpoint);

      expect(mockFetch).toHaveBeenCalled();

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [url] = mockFetchCall;

      expect(url).toEqual(`${config.apiHost}${endpoint}`);
    });

    test('passes options to fetch', async () => {
      const options = {
        method: HTTPMethod.POST,
        body: JSON.stringify({ foo: 'bar' })
      };
      await apiService.fetch(endpoint, options);

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [, passedOptions] = mockFetchCall;

      expect(passedOptions).toEqual(options);
    });

    test('uses GET by default', async () => {
      await apiService.fetch(endpoint);

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [, options] = mockFetchCall;

      expect(options.method).toEqual(`GET`);
    });

    test('returns response from the api endpoint', async () => {
      const response = await apiService.fetch(endpoint);

      expect(response).toEqual(mockResponse);
    });
  });
});
