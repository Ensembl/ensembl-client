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

import { getType, ActionType } from 'typesafe-actions';

import * as speciesSelectorActions from './speciesSelectorActions';

import initialState, {
  SpeciesSelectorState,
  CurrentItem
} from './speciesSelectorState';

import {
  SearchMatch,
  PopularSpecies
} from 'src/content/app/species-selector/types/species-search';

// NOTE: CurrentItem can be built from a search match or from a popular species
const buildCurrentItem = (data: SearchMatch | PopularSpecies): CurrentItem => {
  return {
    genome_id: data.genome_id,
    reference_genome_id: data.reference_genome_id,
    common_name: data.common_name,
    scientific_name: data.scientific_name,
    assembly_name: data.assembly_name
  };
};

export default function speciesSelectorReducer(
  state: SpeciesSelectorState = initialState,
  action: ActionType<typeof speciesSelectorActions>
): SpeciesSelectorState {
  switch (action.type) {
    case getType(speciesSelectorActions.setSearchText):
      return {
        ...state,
        search: {
          ...state.search,
          text: action.payload
        }
      };
    case getType(speciesSelectorActions.fetchSpeciesSearchResults.success):
      return {
        ...state,
        search: {
          ...state.search,
          ...action.payload
        }
      };
    case getType(speciesSelectorActions.setSelectedSpecies):
      return {
        ...state,
        currentItem: buildCurrentItem(action.payload),
        search: initialState.search
      };
    // TODO: wait for strains
    // case getType(speciesSelectorActions.fetchStrainsAsyncActions.success):
    //   return {
    //     ...state,
    //     currentItem: {
    //       ...(state.currentItem as CurrentItem),
    //       strains: action.payload.strains,
    //       selectedStrainId: action.payload.strains.length
    //         ? (state.currentItem as CurrentItem).genome_id
    //         : null
    //     }
    //   };
    case getType(
      speciesSelectorActions.fetchPopularSpeciesAsyncActions.success
    ):
      return {
        ...state,
        popularSpecies: action.payload.popularSpecies
      };
    case getType(speciesSelectorActions.updateCommittedSpecies):
      return {
        ...state,
        committedItems: action.payload
      };
    case getType(speciesSelectorActions.clearSearch):
      return {
        ...state,
        search: initialState.search
      };
    case getType(speciesSelectorActions.clearSearchResults):
      return {
        ...state,
        search: { ...state.search, results: initialState.search.results }
      };
    case getType(speciesSelectorActions.clearSelectedSearchResult):
      return {
        ...state,
        currentItem: null
      };
    default:
      return state;
  }
}
