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
import { setDefaultParameters } from '../vep-form/vepFormSlice';

import { getVepFormParameters } from '../vep-form/vepFormSelectors';

import type { VepResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';
import type { VepFormConfig } from 'src/content/app/tools/vep/types/vepFormConfig';
import type { VEPSubmissionPayload } from 'src/content/app/tools/vep/types/vepSubmission';
import type { RootState } from 'src/store';

const vepApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    vepFormConfig: builder.query<VepFormConfig, void>({
      queryFn: async (_, { dispatch, getState }) => {
        // TODO: the query function will accept a genome id,
        // and will send request to:
        // `${config.toolsApiBaseUrl}/vep/config?genome_id=${genomeId}`
        // to fetch data.
        // Meanwhile, until the back-end endpoint is developed,
        // this function returns hard-coded response payload.
        const mockResponseModule = await import(
          'src/content/app/tools/vep/state/vep-api/fixtures/mockVepFormConfig'
        );
        const vepFormConfig = mockResponseModule.default;

        const vepFormParametersInState = getVepFormParameters(
          getState() as RootState
        );

        if (!Object.keys(vepFormParametersInState).length) {
          dispatch(setDefaultParameters(vepFormConfig));
        }

        return {
          data: vepFormConfig
        };
      }
    }),
    vepFormSubmission: builder.mutation<
      { submissionId: string },
      VEPSubmissionPayload
    >({
      // FIXME: uncomment when the back-end endpoint is ready
      // query: (payload) => ({
      //   url: `${config.toolsApiBaseUrl}/vep/submission`,
      //   method: 'POST',
      //   body: prepareSubmissionFormData(payload)
      // }),

      // TODO: remove when the back-end endpoint is ready
      queryFn: async (payload) => {
        const submissionUrl = `${config.toolsApiBaseUrl}/vep/submission`;
        // eslint-disable-next-line
        console.log(
          'url',
          submissionUrl,
          'payload',
          prepareSubmissionFormData(payload)
        );

        return {
          data: { submissionId: 'fake-id' }
        };
      }
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

/**
 * This function transforms the JSON payload passed into vepFormSubmission function
 * into a FormData object necessary to submit a multipart/form-data request.
 * While vepFormSubmission could have received a FormData object as its argument in the first place,
 * the presence of this function allows us to type-check the payload.
 */
const prepareSubmissionFormData = (payload: VEPSubmissionPayload) => {
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
