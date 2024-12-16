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
import { BiomartTable } from './biomartSlice';

type BiomartColumnBackend = {
  label: string;
  name: string;
  heading: string;
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
        url: 'http://127.0.0.1:5500/biomart_filters.json'
      }),
      keepUnusedDataFor: 60 * 60
    })
  })
});

export const { useBiomartColumnSelectionQuery, useBiomartFiltersQuery } =
  biomartApiSlice;
