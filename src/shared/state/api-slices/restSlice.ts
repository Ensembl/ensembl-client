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

import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchArgs } from '@reduxjs/toolkit/dist/query';

// all queries will retry up to 5 times upon server error with the status code within the 500 range
// see docs: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-retries
const staggeredBaseQueryWithBailout = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const result = await fetchBaseQuery({ baseUrl: '/' })(
      args,
      api,
      extraOptions
    );

    // bail out of re-tries immediately if the error is in the 400 range (client's fault);
    // this is unlikely to change; and subsequent retries will be redundant
    if (Number(result.error?.status) < 500) {
      retry.fail(result.error);
    }

    return result;
  },
  {
    maxRetries: 5
  }
);

export const isMissingResourceError = (
  error?: SerializedError | FetchBaseQueryError
): boolean => {
  const hasErrorStatus = error && 'status' in error;
  if (!hasErrorStatus) {
    return false;
  }

  const errorStatus = error.status;
  return errorStatus === 404;
};

export default createApi({
  reducerPath: 'restApi',
  baseQuery: staggeredBaseQueryWithBailout,
  endpoints: () => ({}) // will inject endpoints in other files
});
