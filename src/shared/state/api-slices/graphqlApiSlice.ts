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

import { createApi } from '@reduxjs/toolkit/query/react';
import { request, ClientError } from 'graphql-request';

const graphqlBaseQuery = async ({
  body,
  url,
  variables = {}
}: {
  url: string;
  body: string;
  variables?: Record<string, string | number | boolean>;
}) => {
  try {
    const result = await request(url, body, variables);
    return { data: result };
  } catch (error) {
    if (error instanceof ClientError) {
      const { name, message, stack, request, response } = error;
      return {
        error: {
          status: error.response.status,
          meta: {
            data: error.response.data ?? null,
            errors: error.response.errors
          },
          name,
          message,
          stack
        },
        meta: { request, response }
      };
    }
    return {
      error: {
        status: 500,
        meta: { error: (error as Error).message }
      }
    };
  }
};

export default createApi({
  reducerPath: 'thoasApi',
  baseQuery: graphqlBaseQuery,
  endpoints: () => ({}) // will inject endpoints in other files
});
