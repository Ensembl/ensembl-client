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

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

import config from 'config';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { GenomeInfo, GenomeKaryotypeItem } from './genomeTypes';

type GenomeInfoResponse = {
  genomeId: string;
  urlSlug: string | null;
  genomeInfo: GenomeInfo;
};

const genomeApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    genomeInfo: builder.query<GenomeInfoResponse, string>({
      query: (genomeId) => {
        const url = `${config.genomeSearchBaseUrl}/genome/info?genome_id=${genomeId}`;
        return {
          url
        };
      },
      transformResponse: (response: { genome_info: GenomeInfo[] }) => {
        const genomeInfo = response.genome_info[0];
        const { genome_id, url_slug } = genomeInfo;

        return {
          genomeId: genome_id,
          urlSlug: url_slug,
          genomeInfo: response.genome_info[0]
        };
      }
    }),
    genomeKaryotype: builder.query<GenomeKaryotypeItem[], string>({
      query: (genomeId) => ({
        url: `${config.genomeSearchBaseUrl}/genome/karyotype?genome_id=${genomeId}`
      })
    })
  })
});

export const { useGenomeInfoQuery, useGenomeKaryotypeQuery } = genomeApiSlice;

export const { genomeInfo: fetchGenomeInfo } = genomeApiSlice.endpoints;

export const isGenomeNotFoundError = (
  error?: SerializedError | FetchBaseQueryError
) => {
  return error && 'status' in error && error.status >= 400; // FIXME: change to 404 when the backend is updated
};
