import { Epic } from 'redux-observable';
import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  map,
  switchMap,
  filter,
  distinctUntilChanged,
  catchError
} from 'rxjs/operators';
import { isActionOf, ActionType, PayloadAction } from 'typesafe-actions';

import * as speciesSelectorActions from 'src/content/app/species-selector/state/speciesSelectorActions';

import { RootState } from 'src/store';

type Action = ActionType<typeof speciesSelectorActions>;

// FIXME: this is a mock implementation of the fetcher
export const fetchSpeciesSearchResultsEpic: Epic<Action, Action, RootState> = (
  action$
) =>
  action$.pipe(
    filter(
      isActionOf([
        speciesSelectorActions.fetchSpeciesSearchResults.request,
        speciesSelectorActions.clearSearchResults
      ])
    ),
    distinctUntilChanged(
      // do not allow identical queries to go through;
      // but reset this rule every time user clears search results
      (action1, action2) =>
        action1.type === action2.type &&
        (action1 as PayloadAction<
          'species_selector/species_search_request',
          string
        >).payload ===
          (action2 as PayloadAction<
            'species_selector/species_search_request',
            string
          >).payload
    ),
    filter(
      isActionOf(speciesSelectorActions.fetchSpeciesSearchResults.request)
    ),
    switchMap((action) => {
      const query = action.payload;
      const url = `/api/genome_search?query=${encodeURIComponent(query)}`;
      return fromFetch(url).pipe(
        switchMap((response) => {
          if (response.ok) {
            // OK return data
            return response.json();
          } else {
            // Server is returning a status requiring the client to try something else.
            return of({ error: true, message: `Error ${response.status}` });
          }
        }),
        catchError((err) => {
          // Network or other error, handle appropriately
          return of({ error: true, message: err.message });
        })
      );
    }),
    map((response) => {
      return speciesSelectorActions.fetchSpeciesSearchResults.success({
        results: response
      });
    })
  );
