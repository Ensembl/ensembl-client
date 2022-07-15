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
import { map, switchMap, tap, filter, distinctUntilChanged } from 'rxjs';
import { isAnyOf, Action } from '@reduxjs/toolkit';
import queryString from 'query-string';

import speciesSelectorStorageService from 'src/content/app/species-selector/services/species-selector-storage-service';

import {
  getCommittedSpecies,
  getCommittedSpeciesById
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import * as observableApiService from 'src/services/observable-api-service';
import {
  fetchSpeciesSearchResults,
  setSelectedSpecies,
  setSearchResults,
  clearSearch,
  clearSearchResults,
  updateCommittedSpecies
} from 'src/content/app/species-selector/state/speciesSelectorSlice';
import { fetchGenomeInfo } from 'src/shared/state/genome/genomeApiSlice';

import type { RootState } from 'src/store';
import type {
  SearchMatches,
  CommittedItem
} from 'src/content/app/species-selector/types/species-search';

export const fetchSpeciesSearchResultsEpic: Epic<Action, Action, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(
      isAnyOf(
        fetchSpeciesSearchResults,
        setSelectedSpecies,
        clearSearch,
        clearSearchResults
      )
    ),
    distinctUntilChanged(
      // ignore actions that have identical queries
      // (which may happen because of white space trimming in SpeciesSearchField,
      // but forget the previous query every time user clears search results
      (action1, action2) =>
        action1.type === action2.type && action1.payload === action2.payload
    ),
    filter(fetchSpeciesSearchResults.match),
    switchMap((action) => {
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
    }),
    map((response) => {
      if (!('error' in response)) {
        return setSearchResults(response.genome_matches);
      } else {
        // To respect redux contract, we must return a valid action from an epic.
        // Although we aren't really handling this action anywhere downstream.
        return { type: 'species-selector/fetchSpeciesSearchResultsError' };
      }
    })
  );

/**
 * When information about a genome is fetched:
 * - check that this genome exists among committed species
 * - if it doesn't, use the fetched information to add this genome to the list of committed species
 * - and save the updated list of committed species to the browser storage
 */
export const ensureCommittedSpeciesEpic: Epic<Action, Action, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(fetchGenomeInfo.matchFulfilled),
    map((action) => {
      const state = state$.value;
      return {
        action,
        state
      };
    }),
    filter(({ action, state }) => {
      // check that the genome is not among committed species
      const genomeId = action.payload.genomeId;
      const speciesAlreadyCommitted = getCommittedSpeciesById(state, genomeId);
      return !speciesAlreadyCommitted;
    }),
    map(({ action, state }) => {
      const { genomeInfo } = action.payload;
      const newSpecies: CommittedItem = {
        genome_id: genomeInfo.genome_id,
        common_name: genomeInfo.common_name,
        scientific_name: genomeInfo.scientific_name,
        assembly_name: genomeInfo.assembly_name,
        url_slug: genomeInfo.url_slug,
        isEnabled: true
      };
      const allCommittedSpecies = [...getCommittedSpecies(state), newSpecies];
      return allCommittedSpecies;
    }),
    tap((allCommittedSpecies) => {
      speciesSelectorStorageService.saveSelectedSpecies(allCommittedSpecies);
    }),
    map((allCommittedSpecies) => {
      return updateCommittedSpecies(allCommittedSpecies);
    })
  );
