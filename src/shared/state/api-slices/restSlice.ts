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

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  fetch as crossFetch,
  Headers as crossFetchHeaders,
  Request as crossFetchRequest,
  Response as crossFetchResponse
} from 'cross-fetch';

/**
 * TODO:
 * Since version 17.5, Node has added its own native implementation of fetch (yay!)
 * (https://github.com/nodejs/node/commit/6ec225392675c92b102d3caad02ee3a157c9d1b7)
 * But it is still experimental, and requires the `--experimental-fetch` flag.
 * Once this feature is stabilized and we update to the new version of Node (new LTS or earlier),
 * the cross-fetch module will become unnecessary; and the code below, as well as the fetchFn parameter
 * of the `fetchBaseQuery` function can be deleted.
 * */
if (!globalThis.fetch) {
  globalThis.fetch = crossFetch;
  globalThis.Headers = crossFetchHeaders;
  globalThis.Request = crossFetchRequest;
  globalThis.Response = crossFetchResponse;
}

export default createApi({
  reducerPath: 'restApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/', fetchFn: fetch }),
  endpoints: () => ({}) // will inject endpoints in other files
});
