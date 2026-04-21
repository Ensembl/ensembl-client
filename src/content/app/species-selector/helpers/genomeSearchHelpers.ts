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

import type { SortOrder } from 'src/shared/types/sort-order';
import type { SortProps } from 'src/content/app/species-selector/components/species-search-results-table/SpeciesSearchResultsTable';

export const getSortRule = (
  sortBy: string | null,
  sortOrder: string | null
) => {
  if (!sortBy) {
    return null;
  } else if (!sortOrder) {
    return {
      sortBy,
      sortOrder: 'asc'
    } as SortProps;
  } else {
    sortOrder = isValidSortOrder(sortOrder) ? sortOrder : 'asc';
    return {
      sortBy,
      sortOrder
    } as SortProps;
  }
};

export const isValidSortOrder = (input: string): input is SortOrder => {
  return input === 'asc' || input === 'desc';
};
