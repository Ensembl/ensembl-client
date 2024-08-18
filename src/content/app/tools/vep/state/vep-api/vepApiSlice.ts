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

import { request } from 'graphql-request';

import config from 'config';

import {
  variantDefaultQuery,
  type VepExampleVariantQueryResult
} from './queries/vepExampleVariantQuery';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import { fetchExampleObjectsForGenome } from 'src/shared/state/genome/genomeApiSlice';

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
    vepFormExampleInput: builder.query<
      { vcfString?: string },
      // { submission_id: string },
      { genomeId: string }
    >({
      queryFn: async (params, { dispatch }) => {
        const { genomeId } = params;
        const { data: exampleObjects } = await dispatch(
          fetchExampleObjectsForGenome.initiate(genomeId, { subscribe: false })
        );

        if (!exampleObjects) {
          throw new Error(); // FIXME
        }

        const exampleVariant = exampleObjects.find(
          (item) => item.type === 'variant'
        );

        if (!exampleVariant) {
          throw new Error(); // FIXME
        }

        const { variant } = await request<VepExampleVariantQueryResult>({
          url: config.variationApiUrl,
          document: variantDefaultQuery,
          variables: {
            genomeId,
            variantId: exampleVariant.id
          }
        });

        if (!variant) {
          throw new Error(); // FIXME
        }

        const firstAltAllele = variant.alleles[0];
        const regionName = variant.slice.region.name;
        const start = firstAltAllele.slice.location.start;
        const refSeq = firstAltAllele.reference_sequence;
        const altSeq = firstAltAllele.allele_sequence;
        const vcfString = `${regionName} ${start} . ${refSeq} ${altSeq}`;

        return {
          data: {
            vcfString
          }
        };
      }
    }),
    vepFormSubmission: builder.mutation<
      {
        old_submission_id: string;
        new_submission_id: string;
      },
      VepSubmissionPayload
    >({
      query: (payload) => ({
        url: `${config.toolsApiBaseUrl}/vep/submissions`,
        method: 'POST',
        body: prepareSubmissionFormData(payload)
      }),
      transformResponse: (response: { submission_id: string }, _, params) => {
        return {
          old_submission_id: params.submission_id,
          new_submission_id: response.submission_id
        };
      },
      transformErrorResponse: (response, meta, params) => {
        return {
          submission_id: params.submission_id
        };
      }
    }),
    vepResults: builder.query<
      VepResultsResponse,
      {
        submission_id: string;
        page: number;
        per_page: number;
      }
    >({
      query: ({ submission_id, page, per_page }) => ({
        url: `${config.toolsApiBaseUrl}/vep/submissions/${submission_id}/results?page=${page}&per_page=${per_page}`
      })
      // queryFn: async ({ submission_id, page, per_page }) => {
      //   // TODO: the query function will accept a submission id,
      //   // and will send request to:
      //   //
      //   // to fetch data.
      //   // Meanwhile, until the back-end endpoint is developed,
      //   // this function returns hard-coded response payload.

      //   const url = `${config.toolsApiBaseUrl}/vep/submissions/${submission_id}/results?page=${page}&per_page=${per_page}`;
      //   const mockResponseModule = await import(
      //     'tests/fixtures/vep/mockVepResults'
      //   );
      //   const mockResponse = mockResponseModule.default;
      //   return {
      //     data: mockResponse
      //   };
      // }
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
  useVepFormExampleInputQuery,
  useVepResultsQuery,
  useVepFormSubmissionMutation
} = vepApiSlice;

export const {
  vepFormConfig: vepFormConfigQuery,
  vepFormSubmission: vepFormSubmit
} = vepApiSlice.endpoints;
