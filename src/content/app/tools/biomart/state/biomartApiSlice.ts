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
import {
  BiomartFilter,
  BiomartGeneFilter,
  BiomartRegionFilter,
  BiomartTable
} from 'src/content/app/tools/biomart/state/biomartSlice';

type BiomartColumnBackend = {
  label: string;
  name: string;
  heading: string;
};

// Temporary solution until filters endpoint is implemented
const getBiomartFilters = () => {
  const region: BiomartRegionFilter = {
    chromosomes: {
      input: ['chr1', 'chr2'],
      bm_backend_key: 'filter_chromosomes',
      output: [],
      expanded: false
    },
    coordinates: {
      input: [],
      bm_backend_key: 'filter_coordinates',
      output: [],
      expanded: false
    },
    expanded: false
  };
  const gene: BiomartGeneFilter = {
    gene_types: {
      input: ['gene_type1', 'gene_type2'],
      bm_backend_key: 'filter_gene_types',
      output: [],
      expanded: false
    },
    gene_sources: {
      input: ['gene_source1', 'gene_source2'],
      bm_backend_key: 'filter_gene_sources',
      output: [],
      expanded: false
    },
    transcript_types: {
      input: ['transcript_type1', 'transcript_type2'],
      bm_backend_key: 'filter_transcript_types',
      output: [],
      expanded: false
    },
    transcript_sources: {
      input: ['transcript_source1', 'transcript_source2'],
      bm_backend_key: 'filter_transcript_sources',
      output: [],
      expanded: false
    },
    gene_stable_id: {
      input: [],
      bm_backend_key: 'filter_gene_stable_id',
      output: [],
      expanded: false
    },
    transcript_stable_id: {
      input: [],
      bm_backend_key: 'filter_transcript_stable_id',
      output: [],
      expanded: false
    },
    expanded: false
  };
  const filters: BiomartFilter = {
    region: region,
    gene: gene
  };
  return filters;
};

const biomartApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    biomartColumnSelection: builder.query({
      query: () => ({
        url: 'http://ec2-18-134-246-34.eu-west-2.compute.amazonaws.com:54301/query_attribs/core'
      }),
      transformResponse: (response: BiomartColumnBackend[]) => {
        const columns: BiomartTable[] = [];
        response.forEach((data) => {
          let existingColumn;
          for (const column of columns) {
            if (column.label === data.heading) {
              existingColumn = column;
              break;
            }
          }

          if (existingColumn) {
            existingColumn.options.push({
              label: data.label,
              name: data.name,
              checked: false
            });
          } else {
            columns.push({
              label: data.heading,
              options: [
                {
                  label: data.label,
                  name: data.name,
                  checked: false
                }
              ],
              expanded: false
            });
          }
        });
        return columns;
      },
      keepUnusedDataFor: 60 * 60
    }),
    biomartFilters: builder.query({
      query: () => ({
        url: 'http://ec2-18-134-246-34.eu-west-2.compute.amazonaws.com:54301/query_filters/core'
      }),
      transformResponse: () => {
        // Temporary solution until filters endpoint is implemented
        return getBiomartFilters();
      },
      keepUnusedDataFor: 60 * 60
    }),
    biomartJob: builder.query({
      query: (taskid: string) => ({
        url: `http://ec2-18-134-246-34.eu-west-2.compute.amazonaws.com:54301/poll_task/${taskid}`
      }),
      keepUnusedDataFor: 60 * 60
    }),
    biomartRun: builder.mutation({
      query: (payload) => ({
        url: 'http://ec2-18-134-246-34.eu-west-2.compute.amazonaws.com:54301/run_query',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload
      })
    })
  })
});

export const {
  useBiomartColumnSelectionQuery,
  useBiomartFiltersQuery,
  useBiomartRunMutation,
  useLazyBiomartJobQuery
} = biomartApiSlice;
