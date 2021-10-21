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

import { Epic } from 'redux-observable';
import { map, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';

import { isAnyOf, AnyAction } from '@reduxjs/toolkit';

import queryString from 'query-string';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import * as observableApiService from 'src/services/observable-api-service';
import {
  setSelectedSpecies,
  clearSearch,
  clearSearchResults,
  fetchSpeciesSearchResultsRequest,
  fetchSpeciesSearchResultsFailure,
  fetchSpeciesSearchResultsSuccess
} from 'src/content/app/species-selector/state/speciesSelectorSlice';

import { RootState } from 'src/store';
import { SearchMatches } from 'src/content/app/species-selector/types/species-search';

type Action =
  | ReturnType<typeof setSelectedSpecies>
  | ReturnType<typeof clearSearch>
  | ReturnType<typeof clearSearchResults>
  | ReturnType<typeof fetchSpeciesSearchResultsRequest>
  | ReturnType<typeof fetchSpeciesSearchResultsFailure>
  | ReturnType<typeof fetchSpeciesSearchResultsSuccess>;

export const fetchSpeciesSearchResultsEpic: Epic<AnyAction, Action, RootState> =
  (action$, state$) =>
    action$.pipe(
      filter(
        isAnyOf(
          fetchSpeciesSearchResultsRequest,
          setSelectedSpecies,
          clearSearch,
          clearSearchResults
        )
      ),
      distinctUntilChanged(
        // ignore actions that have identical queries
        // (which may happen because of white space trimming in SpeciesSearchField,
        // but forget the previous query every time user clears search results
        (action1: Action, action2: Action) =>
          action1.type === action2.type && action1.payload === action2.payload
      ),
      filter(isAnyOf(fetchSpeciesSearchResultsRequest)),
      switchMap(
        (action: ReturnType<typeof fetchSpeciesSearchResultsRequest>) => {
          const committedSpeciesIds = getCommittedSpecies(state$.value).map(
            (species) => species.genome_id
          );
          const query = queryString.stringify({
            query: encodeURIComponent(action.payload),
            limit: 20,
            exclude: committedSpeciesIds
          });
          const url = `/api/genomesearch/genome_search?${query}`;
          return observableApiService.fetch<{
            genome_matches: SearchMatches[];
            total_hits: number;
          }>(url);
        }
      ),
      map((response) => {
        if ('error' in response) {
          // TODO: develop a strategy for handling network errors
          return fetchSpeciesSearchResultsFailure(response.message);
        } else {
          return fetchSpeciesSearchResultsSuccess({
            results: response.genome_matches
          });
        }
      })
    );
