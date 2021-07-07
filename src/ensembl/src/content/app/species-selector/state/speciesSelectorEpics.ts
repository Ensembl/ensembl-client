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
import { isActionOf, ActionType, PayloadAction } from 'typesafe-actions';
import queryString from 'query-string';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import * as observableApiService from 'src/services/observable-api-service';
import * as speciesSelectorActions from 'src/content/app/species-selector/state/speciesSelectorActions';

import { RootState } from 'src/store';
import { SearchMatches } from 'src/content/app/species-selector/types/species-search';

type Action = ActionType<typeof speciesSelectorActions>;

export const fetchSpeciesSearchResultsEpic: Epic<Action, Action, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(
      isActionOf([
        speciesSelectorActions.fetchSpeciesSearchResults.request,
        speciesSelectorActions.setSelectedSpecies,
        speciesSelectorActions.clearSearch,
        speciesSelectorActions.clearSearchResults
      ])
    ),
    distinctUntilChanged(
      // ignore actions that have identical queries
      // (which may happen because of white space trimming in SpeciesSearchField,
      // but forget the previous query every time user clears search results
      (action1, action2) =>
        action1.type === action2.type &&
        (
          action1 as PayloadAction<
            'species_selector/species_search_request',
            string
          >
        ).payload ===
          (
            action2 as PayloadAction<
              'species_selector/species_search_request',
              string
            >
          ).payload
    ),
    filter(
      isActionOf(speciesSelectorActions.fetchSpeciesSearchResults.request)
    ),
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
      if ('error' in response) {
        // TODO: develop a strategy for handling network errors
        return speciesSelectorActions.fetchSpeciesSearchResults.failure(
          response.message
        );
      } else {
        return speciesSelectorActions.fetchSpeciesSearchResults.success({
          results: response.genome_matches
        });
      }
    })
  );
