// this service temporarily uses the native browser fetch API;
// we will modify it to use a library once we decide which one to choose

import config from 'config';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

type ApiServiceConfig = {
  host: string;
};

type FetchOptions = {
  host?: string;
  method?: HTTPMethod;
  headers?: { [key: string]: string };
  body?: string; // stringified json
};

class ApiService {
  private host: string;

  public constructor(config: ApiServiceConfig) {
    this.host = config.host;
  }

  // temporary method, for easy testing, until we choose a library
  public getFetch() {
    return fetch;
  }

  public async fetch(
    endpoint: string,
    options: FetchOptions = {
      method: HTTPMethod.GET,
      headers: { 'Content-Type': 'application/json' }
    }
  ) {
    const host = options.host || this.host;
    const fetch = this.getFetch();
    const url = /^https?:\/\//.test(endpoint) ? endpoint : `${host}${endpoint}`;

    try {
      const response = await fetch(url, options);
      return await this.handleResponse(response, options);
    } catch (error) {
      throw error;
    }
  }

  private async handleResponse(response: Response, options: FetchOptions) {
    if (
      options.headers &&
      options.headers['Content-Type'] === 'application/json'
    ) {
      return await response.json();
    } else {
      return await response.text();
    }
  }
}

export default new ApiService({
  host: config.apiHost
});
