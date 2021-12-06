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

const graphqlBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
  async ({
    body,
    variables = {}
  }: {
    body: string;
    variables?: Record<string, string | number | boolean>;
  }) => {
    try {
      const result = await request(baseUrl, body, variables);
      return { data: result };
    } catch (error) {
      if (error instanceof ClientError) {
        return { error: { status: error.response.status, data: error } };
      }
      return { error: { status: 500, data: error } };
    }
  };

export default createApi({
  reducerPath: 'thoasApi',
  baseQuery: graphqlBaseQuery({
    baseUrl: '/api/thoas'
  }),
  endpoints: () => ({}) // will inject endpoints in other files
});
