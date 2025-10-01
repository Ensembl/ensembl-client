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

import { faker } from '@faker-js/faker';

import apiService, { HTTPMethod } from '../api-service';
import config from 'config';
import LRUCache from 'src/shared/utils/lruCache';

vi.mock('config', () => ({
  apiHost: 'http://foo.bar'
}));

const generateMockFetch = (response: any) =>
  vi.fn(() => Promise.resolve(response));

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
    json: vi.fn(mockJsonResolver),
    text: vi.fn(mockTextResolver)
  });
  const generateMockErrorResponse = () => ({
    ok: false,
    status: 400,
    json: vi.fn(mockErrorResolver)
  });

  beforeEach(() => {
    const mockSuccessResponse = generateMockSuccessResponse();
    mockFetch = generateMockFetch(mockSuccessResponse);
    LRUCache.prototype.get = vi.fn();
    LRUCache.prototype.set = vi.fn();
    vi.spyOn(apiService, 'getFetch').mockImplementation(() => mockFetch as any);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('.fetch', () => {
    const endpoint = `/${faker.lorem.word()}/${faker.lorem.word()}`;

    it('calls fetch passing it the endpoint', async () => {
      await apiService.fetch(endpoint);

      expect(mockFetch).toHaveBeenCalled();

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [url] = mockFetchCall;

      expect(url).toEqual(`${config.apiHost}${endpoint}`);
    });

    it('respects an option for not modifying the endpoint', async () => {
      await apiService.fetch(endpoint, { preserveEndpoint: true });

      expect(mockFetch).toHaveBeenCalled();

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [url] = mockFetchCall;

      expect(url).toEqual(endpoint);
    });

    it('respects the host passed in options', async () => {
      const host = faker.internet.url();
      await apiService.fetch(endpoint, { host });

      expect(mockFetch).toHaveBeenCalled();

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [url] = mockFetchCall;

      expect(url).toEqual(`${host}${endpoint}`);
    });

    it('passes options to fetch', async () => {
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

    it('uses GET by default', async () => {
      await apiService.fetch(endpoint);

      const mockFetchCall: any[] = mockFetch.mock.calls[0];
      const [, options] = mockFetchCall;

      expect(options.method).toEqual(`GET`);
    });

    it('returns response from the api endpoint', async () => {
      const response = await apiService.fetch(endpoint);

      expect(response).toEqual(mockResponse);
    });

    it('caches the response', async () => {
      let response = await apiService.fetch(endpoint, {
        preserveEndpoint: true
      });
      // first, api service will try to access the cache
      expect(LRUCache.prototype.get).toHaveBeenCalledTimes(1);
      expect(LRUCache.prototype.get).toHaveBeenCalledWith(endpoint);
      // since the cache is empty, api service will fetch the data
      expect(mockFetch).toHaveBeenCalledTimes(1);
      // and it will store response in the cache
      expect(LRUCache.prototype.set).toHaveBeenCalledTimes(1);
      expect(LRUCache.prototype.set).toHaveBeenCalledWith(endpoint, response);

      vi.resetAllMocks();

      const mockCachedResponse = { foo: 'this comes from cache' };
      vi.spyOn(LRUCache.prototype, 'get').mockImplementation(
        () => mockCachedResponse
      );

      response = await apiService.fetch(endpoint, { preserveEndpoint: true });
      expect(LRUCache.prototype.get).toHaveBeenCalledTimes(1); // checks cache and gets item from cache
      expect(mockFetch).not.toHaveBeenCalled();
      expect(LRUCache.prototype.set).not.toHaveBeenCalled();
      expect(response).toEqual(mockCachedResponse);
    });

    it('respects the option not to cache the response', async () => {
      const response = await apiService.fetch(endpoint, { noCache: true });
      expect(LRUCache.prototype.get).not.toHaveBeenCalled();
      expect(LRUCache.prototype.set).not.toHaveBeenCalled();

      expect(response).toEqual(mockResponse);
    });

    describe('when request fails', () => {
      let mockFetch: any;
      let mockErrorResponse: any;

      beforeEach(() => {
        mockErrorResponse = generateMockErrorResponse();
        mockFetch = generateMockFetch(mockErrorResponse);

        vi.spyOn(apiService, 'getFetch').mockImplementation(() => mockFetch);
      });

      it('throws an error', async () => {
        const expectedError = {
          ...mockError,
          status: mockErrorResponse.status
        };

        await expect(apiService.fetch(endpoint)).rejects.toEqual(expectedError);
      });
    });
  });
});
