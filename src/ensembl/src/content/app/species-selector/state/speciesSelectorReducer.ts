import { getType, ActionType } from 'typesafe-actions';

import * as speciesSelectorActions from './speciesSelectorActions';

import initialState, { SpeciesSelectorState } from './speciesSelectorState';

export default function speciesSelectorReducer(
  state: SpeciesSelectorState = initialState,
  action: ActionType<typeof speciesSelectorActions>
): SpeciesSelectorState {
  switch (action.type) {
    case getType(speciesSelectorActions.fetchSpeciesSearchResults.success):
      return {
        ...state,
        search: action.payload
      };
    case getType(speciesSelectorActions.setSelectedSearchResult):
      return {
        ...state,
        currentItem: {
          searchMatch: action.payload,
          selectedStrain: null,
          selectedAssembly: null
        }
      };
    default:
      return state;
  }
}
