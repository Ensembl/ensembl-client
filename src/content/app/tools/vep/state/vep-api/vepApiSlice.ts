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

import config from 'config';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { VepResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';
import type { VepFormConfig } from 'src/content/app/tools/vep/types/vepFormConfig';
import type { VepSubmissionPayload } from 'src/content/app/tools/vep/types/vepSubmission';

const vepApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    vepFormConfig: builder.query<VepFormConfig, { genome_id: string }>({
      // eslint-disable-next-line
      queryFn: async (params) => {
        // TODO: the query function will accept a genome id,
        // and will send request to:
        // `${config.toolsApiBaseUrl}/vep/config?genome_id=${genomeId}`
        // to fetch data.
        // Meanwhile, until the back-end endpoint is developed,
        // this function returns hard-coded response payload.
        const mockResponseModule = await import(
          'tests/fixtures/vep/mockVepFormConfig'
        );
        const vepFormConfig = mockResponseModule.default;

        // simulate network delay
        await new Promise((resolve) => {
          setTimeout(resolve, 200);
        });

        return {
          data: vepFormConfig
        };
      }
    }),
    vepFormSubmission: builder.mutation<
      { submission_id: string },
      VepSubmissionPayload
    >({
      query: (payload) => ({
        url: `${config.toolsApiBaseUrl}/vep/submissions`,
        method: 'POST',
        body: prepareSubmissionFormData(payload)
      })
    }),
    vepResults: builder.query<VepResultsResponse, void>({
      queryFn: async () => {
        // TODO: the query function will accept a submission id,
        // and will send request to:
        // `${config.toolsApiBaseUrl}/vep/submissions/${submissionId}/results`
        // to fetch data.
        // Meanwhile, until the back-end endpoint is developed,
        // this function returns hard-coded response payload.
        const mockResponseModule = await import(
          'tests/fixtures/vep/mockVepResults'
        );
        const mockResponse = mockResponseModule.default;
        return {
          data: mockResponse
        };
      }
    })
  })
});

/**
 * This function transforms the JSON payload passed into vepFormSubmission function
 * into a FormData object necessary to submit a multipart/form-data request.
 * While vepFormSubmission could have received a FormData object as its argument in the first place,
 * the presence of this function allows us to type-check the payload.
 */
const prepareSubmissionFormData = (payload: VepSubmissionPayload) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value);
  }

  return formData;
};

export const {
  useVepFormConfigQuery,
  useVepResultsQuery,
  useVepFormSubmissionMutation
} = vepApiSlice;
