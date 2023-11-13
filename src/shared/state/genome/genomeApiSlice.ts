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

import upperFirst from 'lodash/upperFirst';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

import config from 'config';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type {
  BriefGenomeSummary,
  GenomeKaryotypeItem,
  ExampleFocusObject
} from './genomeTypes';

type GenomeFieldsForFormatting = {
  common_name: string | null;
};
export const formatGenomeData = <T extends GenomeFieldsForFormatting>(
  genome: T
): T => {
  if (genome.common_name) {
    genome.common_name = upperFirst(genome.common_name);
  }
  return genome;
};

const genomeApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // query intended to discover whether a string available to the client is a genome id or a genome tag
    genomeSummaryByGenomeSlug: builder.query<BriefGenomeSummary, string>({
      query: (slug) => ({
        url: `${config.metadataApiBaseUrl}/genome/${slug}/explain`
      }),
      transformResponse: (response: BriefGenomeSummary) =>
        formatGenomeData(response)
    }),
    genomeKaryotype: builder.query<GenomeKaryotypeItem[], string>({
      query: (genomeId) => ({
        url: `${config.metadataApiBaseUrl}/genome/${genomeId}/karyotype`
      })
    }),
    exampleObjectsForGenome: builder.query<ExampleFocusObject[], string>({
      query: (genomeId) => ({
        url: `${config.metadataApiBaseUrl}/genome/${genomeId}/example_objects`
      })
    })
  })
});

export const {
  useGenomeSummaryByGenomeSlugQuery,
  useGenomeKaryotypeQuery,
  useExampleObjectsForGenomeQuery
} = genomeApiSlice;

export const {
  genomeSummaryByGenomeSlug: fetchGenomeSummary,
  exampleObjectsForGenome: fetchExampleObjectsForGenome
} = genomeApiSlice.endpoints;

export const isGenomeNotFoundError = (
  error?: SerializedError | FetchBaseQueryError
): boolean => {
  const hasErrorStatus = error && 'status' in error;
  if (!hasErrorStatus) {
    return false;
  }

  const errorStatus = error.status;
  return typeof errorStatus === 'number' && errorStatus >= 400; // FIXME: change to 404 when the backend is updated
};
