import { Epic } from 'redux-observable';
import { map, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { isActionOf, ActionType, PayloadAction } from 'typesafe-actions';
import queryString from 'query-string';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import * as observableApiService from 'src/services/observable-api-service';
import * as speciesSelectorActions from 'src/content/app/species-selector/state/speciesSelectorActions';

import { RootState } from 'src/store';

type Action = ActionType<typeof speciesSelectorActions>;

// FIXME: this is a mock implementation of the fetcher
export const fetchSpeciesSearchResultsEpic: Epic<Action, Action, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(
      isActionOf([
        speciesSelectorActions.fetchSpeciesSearchResults.request,
        speciesSelectorActions.setSelectedSpecies,
        speciesSelectorActions.clearSearchResults
      ])
    ),
    distinctUntilChanged(
      // ignore actions that have identical queries
      // (which may happen because of white space trimming in SpeciesSearchField,
      // but forget the previous query every time user clears search results
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
      const committedSpeciesIds = getCommittedSpecies(state$.value).map(
        (species) => species.genome_id
      );
      const query = queryString.stringify({
        query: encodeURIComponent(action.payload),
        limit: 20,
        exclude: committedSpeciesIds
      });
      const url = `/api/genome_search?${query}`;
      return observableApiService.fetch(url);
    }),
    map((response) => {
      if (response.error) {
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
