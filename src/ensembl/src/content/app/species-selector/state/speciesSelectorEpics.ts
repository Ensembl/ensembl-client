import { Epic } from 'redux-observable';
import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  map,
  switchMap,
  filter,
  distinctUntilChanged,
  catchError,
  tap
} from 'rxjs/operators';
import { isActionOf, ActionType } from 'typesafe-actions';

import * as speciesSelectorActions from 'src/content/app/species-selector/state/speciesSelectorActions';

import humanMockSearchResults from 'tests/data/species-selector/human-search';
import mouseMockSearchResults from 'tests/data/species-selector/mouse-search';

import { RootState } from 'src/store';

type Action = ActionType<typeof speciesSelectorActions>;

// FIXME: this is a mock implementation of the fetcher
export const fetchSpeciesSearchResultsEpic: Epic<Action, Action, RootState> = (
  action$
) =>
  action$.pipe(
    filter(
      isActionOf(speciesSelectorActions.fetchSpeciesSearchResults.request)
    ),
    distinctUntilChanged(
      (action1, action2) => action1.payload === action2.payload
    ),
    switchMap((action) => {
      const query = action.payload;
      const url = `/api/genome_search?query=${encodeURIComponent(query)}`;
      return fromFetch(url).pipe(
        switchMap((response) => {
          if (response.ok) {
            // OK return data
            console.log('OK');
            console.log('response', response);
            return response.json();
          } else {
            console.log('error in switchmap');
            // Server is returning a status requiring the client to try something else.
            return of({ error: true, message: `Error ${response.status}` });
          }
        }),
        catchError((err) => {
          // Network or other error, handle appropriately
          console.log('error in catcherror');
          console.error(err);
          return of({ error: true, message: err.message });
        })
      );
    }),
    tap(console.log),
    map((response) => {
      console.log('hey whats up', response);
      return speciesSelectorActions.fetchSpeciesSearchResults.success({
        results: response
      });
    })
  );
