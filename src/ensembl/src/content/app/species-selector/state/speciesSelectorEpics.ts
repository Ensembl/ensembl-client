import { Epic } from 'redux-observable';
import { of } from 'rxjs';
import {
  map,
  tap,
  switchMap,
  delay,
  filter,
  distinctUntilChanged
} from 'rxjs/operators';
import { isActionOf, ActionType } from 'typesafe-actions';
import values from 'lodash/values';

import * as speciesSelectorActions from 'src/content/app/species-selector/state/speciesSelectorActions';

import * as mockSearchResults from 'tests/data/species-selector/species-search';

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
    switchMap((action) => of(action).pipe(delay(600))),
    tap((action) => console.log('get action', action)),
    map((action) =>
      speciesSelectorActions.fetchSpeciesSearchResults.success({
        text: action.payload,
        results: values(mockSearchResults)
      })
    )
  );
