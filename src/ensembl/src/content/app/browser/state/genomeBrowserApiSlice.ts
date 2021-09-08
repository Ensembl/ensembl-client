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

import trackPanelGeneQuery from './queries/trackPanelGeneQuery';

import type { TrackPanelGene } from './types/track-panel-gene';

// FIXME: move some place more generic
const graphqlBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
  async ({ body }: { body: string }) => {
    try {
      const result = await request(baseUrl, body);
      return { data: result };
    } catch (error) {
      if (error instanceof ClientError) {
        return { error: { status: error.response.status, data: error } };
      }
      return { error: { status: 500, data: error } };
    }
  };

type GeneQueryParams = { genomeId: string; geneId: string };

export const genomeBrowserApiSlice = createApi({
  reducerPath: 'genomeBrowserApi',
  baseQuery: graphqlBaseQuery({
    baseUrl: '/api/thoas'
  }),
  endpoints: (builder) => ({
    getTrackPanelGene: builder.query<{ gene: TrackPanelGene }, GeneQueryParams>(
      {
        query: (params) => ({
          body: trackPanelGeneQuery(params)
        })
      }
    )
  })
});

export const { getTrackPanelGene } = genomeBrowserApiSlice.endpoints;
export const { useGetTrackPanelGeneQuery } = genomeBrowserApiSlice;
