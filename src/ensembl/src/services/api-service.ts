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

import fetch from 'cross-fetch';

import config from 'config';
import LRUCache from 'src/shared/utils/lruCache';

import JSONValue from 'src/shared/types/JSON';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

// Note: Currently does not conform to Core Data Modelling definition of an API error
export type APIError = {
  status: number;
  message: string | JSONValue;
};

type ApiServiceConfig = {
  host: string;
};

export type FetchOptions = {
  host?: string;
  method?: HTTPMethod;
  headers?: { [key: string]: string };
  body?: string; // stringified json
  preserveEndpoint?: boolean;
  noCache?: boolean;
  signal?: AbortSignal;
};

const defaultMethod = HTTPMethod.GET;
const defaultHeaders = { Accept: 'application/json' };

class ApiService {
  private host: string;
  private cache: LRUCache;

  public constructor(config: ApiServiceConfig) {
    this.host = config.host || '';
    this.cache = new LRUCache({ maxAge: 60 * 60 * 1000 });
  }

  // method to enable easy testing
  public getFetch() {
    return fetch;
  }

  private buildFetchOptions(options: FetchOptions) {
    const headers: { [key: string]: string } = {
      ...defaultHeaders,
      ...options.headers
    };
    if (
      options.method &&
      [HTTPMethod.POST, HTTPMethod.PUT, HTTPMethod.PATCH].includes(
        options.method
      ) &&
      !headers.hasOwnProperty('Content-Type')
    ) {
      headers['Content-Type'] = 'application/json';
    }
    return {
      method: options.method || defaultMethod,
      headers: { ...defaultHeaders, ...options.headers },
      body: options.body,
      signal: options.signal
    };
  }

  public async fetch(endpoint: string, options: FetchOptions = {}) {
    const host = options.host || this.host;
    const fetch = this.getFetch();
    const url = options.preserveEndpoint ? endpoint : `${host}${endpoint}`;

    if (!options.noCache) {
      const cachedItem = this.cache.get(url);
      if (cachedItem) {
        return cachedItem;
      }
    }

    const fetchOptions = this.buildFetchOptions(options);

    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        throw await this.handleError(response);
      }
      const processedResponse = await this.handleResponse(
        response,
        fetchOptions
      );
      if (!options.noCache) {
        this.cache.set(url, processedResponse);
      }
      return processedResponse;
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
    }
  }

  private async handleError(response: Response) {
    let errorJson;
    try {
      errorJson = await response.json();
    } finally {
      return {
        status: response.status,
        ...errorJson
      };
    }
  }

  private async handleResponse(response: Response, options: FetchOptions) {
    if (options.headers && options.headers['Accept'] === 'application/json') {
      return await response.json();
    } else {
      return await response.text();
    }
  }
}

export default new ApiService({
  host: config.apiHost
});
