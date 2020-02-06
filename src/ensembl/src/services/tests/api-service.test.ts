import faker from 'faker';

import apiService, { HTTPMethod } from '../api-service';
import config from 'config';

jest.mock('config', () => ({
  apiHost: 'http://foo.bar'
}));

const generateMockFetch = (response: any) =>
  jest.fn(() => Promise.resolve(response));

describe('api service', () => {
  let mockFetch: any;
  const mockResponse = { foo: 'foo' };
  const mockError = { message: 'Oh no!' };
  const mockTextResponse = 'hello world';

  const mockJsonResolver = () => Promise.resolve(mockResponse);
  const mockTextResolver = () => Promise.resolve(mockTextResponse);
  const mockErrorResolver = () => Promise.resolve(mockError);
  const generateMockSuccessResponse = () => ({
    ok: true,
    json: jest.fn(mockJsonResolver),
    text: jest.fn(mockTextResolver)
  });
  const generateMockErrorResponse = () => ({
    ok: false,
    status: 400,
    json: jest.fn(mockErrorResolver)
  });

  beforeEach(() => {
    const mockSuccessResponse = generateMockSuccessResponse();
    mockFetch = generateMockFetch(mockSuccessResponse);
    jest
      .spyOn(apiService, 'getFetch')
      .mockImplementation(() => mockFetch as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('.fetch', () => {
    const endpoint = `/${faker.lorem.word()}/${faker.lorem.word()}`;

    test('calls fetch passing it the endpoint', async () => {
      await apiService.fetch(endpoint);

      expect(mockFetch).toHaveBeenCalled();

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [url] = mockFetchCall;

      expect(url).toEqual(`${config.apiHost}${endpoint}`);
    });

    test('respects an option for not modifying the endpoint', async () => {
      await apiService.fetch(endpoint, { preserveEndpoint: true });

      expect(mockFetch).toHaveBeenCalled();

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [url] = mockFetchCall;

      expect(url).toEqual(endpoint);
    });

    test('respects the host passed in options', async () => {
      const host = faker.internet.url();
      await apiService.fetch(endpoint, { host });

      expect(mockFetch).toHaveBeenCalled();

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [url] = mockFetchCall;

      expect(url).toEqual(`${host}${endpoint}`);
    });

    test('passes options to fetch', async () => {
      const options = {
        method: HTTPMethod.POST,
        body: JSON.stringify({ foo: 'bar' })
      };
      await apiService.fetch(endpoint, options);

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [, passedOptions] = mockFetchCall;

      Object.keys(options).forEach((option) => {
        expect(options[option as keyof typeof options]).toEqual(
          passedOptions[option]
        );
      });
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

    describe('when request fails', () => {
      let mockFetch: any;
      let mockErrorResponse: any;

      beforeEach(() => {
        mockErrorResponse = generateMockErrorResponse();
        mockFetch = generateMockFetch(mockErrorResponse);

        jest.spyOn(apiService, 'getFetch').mockImplementation(() => mockFetch);
      });

      test('throws an error', async () => {
        const expectedError = {
          ...mockError,
          status: mockErrorResponse.status
        };

        await expect(apiService.fetch(endpoint)).rejects.toEqual(expectedError);
      });
    });
  });
});
