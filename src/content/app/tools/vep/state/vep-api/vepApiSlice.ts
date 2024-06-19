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

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { VEPResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';

const vepApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    vepResults: builder.query<VEPResultsResponse, void>({
      queryFn: async () => {
        // TODO: the query function will accept a submission id,
        // and will send request to:
        // `${config.toolsApiBaseUrl}/vep/submissions/${submissionId}/results`
        // to fetch data.
        // Meanwhile, until the back-end endpoint is developed,
        // this function returns hard-coded response payload.
        const mockResponseModule = await import(
          'src/content/app/tools/vep/state/vep-api/fixtures/mockVepResults'
        );
        const mockResponse = mockResponseModule.default;
        return {
          data: mockResponse
        };
      }
    })
  })
});

export const { useVepResultsQuery } = vepApiSlice;
