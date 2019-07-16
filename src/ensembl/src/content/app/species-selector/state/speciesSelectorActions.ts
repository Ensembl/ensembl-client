import { createAsyncAction, createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import find from 'lodash/find';
import get from 'lodash/get';
import apiService from 'src/services/api-service';

import speciesSelectorStorageService from 'src/content/app/species-selector/services/species-selector-storage-service';

import buildAnalyticsObject from 'src/analyticsHelper';

import {
  getCommittedSpecies,
  getCurrentItem
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import {
  SearchMatch,
  SearchMatches,
  // Strain,
  Assembly,
  PopularSpecies,
  CommittedItem
} from 'src/content/app/species-selector/types/species-search';

import { CurrentItem } from './speciesSelectorState';

const buildCommittedItem = (data: CurrentItem): CommittedItem => ({
  genome_id: data.genome_id,
  reference_genome_id: data.reference_genome_id,
  common_name: data.common_name,
  scientific_name: data.scientific_name,
  assembly_name: get(
    find(data.assemblies, ({ genome_id }) => genome_id === data.genome_id),
    'assembly_name'
  ) as string,
  isEnabled: true
});

export const fetchSpeciesSearchResults = createAsyncAction(
  'species_selector/species_search_request',
  'species_selector/species_search_success',
  'species_selector/species_search_failure'
)<string, { results: SearchMatches[] }, Error>();

// TODO: wait for strains
// export const fetchStrainsAsyncActions = createAsyncAction(
//   'species_selector/strains_request',
//   'species_selector/strains_success',
//   'species_selector/strains_failure'
// )<undefined, { strains: Strain[] }, Error>();

export const fetchPopularSpeciesAsyncActions = createAsyncAction(
  'species_selector/popular_species_request',
  'species_selector/popular_species_success',
  'species_selector/popular_species_failure'
)<undefined, { popularSpecies: PopularSpecies[] }, Error>();

export const fetchAssembliesAsyncActions = createAsyncAction(
  'species_selector/assemblies_request',
  'species_selector/assemblies_success',
  'species_selector/assemblies_failure'
)<undefined, { assemblies: Assembly[] }, Error>();

export const setSelectedSpecies = createAction(
  'species_selector/species_selected',
  (resolve) => {
    return (selectedSpecies: SearchMatch | PopularSpecies, source?: string) => {
      const speciesName =
        selectedSpecies.common_name || selectedSpecies.scientific_name;
      return resolve(
        selectedSpecies,
        buildAnalyticsObject({
          category: source || 'species_selector',
          action: 'preselect',
          label: speciesName
        })
      );
    };
  }
);

export const clearSearchResults = createAction(
  'species_selector/clear_search_results',
  (resolve) => {
    return () =>
      resolve(
        undefined,
        buildAnalyticsObject({
          category: 'popular_species',
          action: 'unselect'
        })
      );
  }
);

export const clearSelectedSearchResult = createAction(
  'species_selector/clear_selected_search_result',
  (resolve) => {
    return () =>
      resolve(
        undefined,
        buildAnalyticsObject({
          category: 'popular_species',
          action: 'unpreselect'
        })
      );
  }
);

// TODO: wait for strains
// export const fetchStrains: ActionCreator<
//   ThunkAction<void, any, null, Action<string>>
// > = (genomeId: string) => async (dispatch) => {
//   try {
//     dispatch(fetchStrainsAsyncActions.request());

//     // FIXME: using mock data here
//     dispatch(
//       fetchStrainsAsyncActions.success({ strains: mouseStrainsResult.strains })
//     );
//   } catch (error) {
//     dispatch(fetchStrainsAsyncActions.failure(error));
//   }
// };

export const fetchAssemblies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch) => {
  try {
    dispatch(fetchAssembliesAsyncActions.request());

    const url = `/api/alternative_assemblies?genome_id=${genomeId}`;
    const response = await apiService.fetch(url, { preserveEndpoint: true });

    dispatch(
      fetchAssembliesAsyncActions.success({
        assemblies: response.alternative_assemblies
      })
    );
  } catch (error) {
    dispatch(fetchAssembliesAsyncActions.failure(error));
  }
};

export const fetchPopularSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => async (dispatch) => {
  try {
    dispatch(fetchPopularSpeciesAsyncActions.request());

    const url = '/api/popular_genomes';
    const response = await apiService.fetch(url);

    dispatch(
      fetchPopularSpeciesAsyncActions.success({
        popularSpecies: response.popular_species
      })
    );
  } catch (error) {
    dispatch(fetchPopularSpeciesAsyncActions.failure(error));
  }
};

export const handleSelectedSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (item: SearchMatch | PopularSpecies, source: string) => (dispatch) => {
  dispatch(setSelectedSpecies(item, source));
  const { genome_id } = item;

  // TODO: fetch strains when they are ready
  // dispatch(fetchStrains(genome_id));
  dispatch(fetchAssemblies(genome_id));
};

export const commitSelectedSpecies = createAction(
  'species_selector/commit_selected_species',
  (resolve) => {
    return (itemName: string, committedSpecies: CommittedItem[]) => {
      return resolve(
        committedSpecies,
        buildAnalyticsObject({
          category: 'add_species',
          label: itemName,
          action: 'select'
        })
      );
    };
  }
);

export const commitSelectedSpeciesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState) => {
  const committedSpecies = getCommittedSpecies(getState());
  const currentItem = getCurrentItem(getState());

  const newCommittedSpecies = [
    ...committedSpecies,
    buildCommittedItem(currentItem)
  ];

  const currentItemName =
    currentItem.common_name || currentItem.scientific_name;
  dispatch(commitSelectedSpecies(currentItemName, newCommittedSpecies));

  speciesSelectorStorageService.saveSelectedSpecies(committedSpecies);
};

export const toggleSpeciesUse = createAction(
  'species_selector/toggle_species_use',
  (resolve) => {
    return (
      speciesName: string,
      currentStatus: string,
      committedSpecies: CommittedItem[]
    ) => {
      return resolve(
        committedSpecies,
        buildAnalyticsObject({
          category: 'selected_Species',
          label: speciesName,
          action: currentStatus
        })
      );
    };
  }
);

export const toggleSpeciesUseAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => (dispatch, getState) => {
  const committedSpecies = getCommittedSpecies(getState());
  let speciesName = '';
  let currentStatus = '';
  committedSpecies.map((item) => {
    if (item.genome_id === genomeId) {
      speciesName = item.common_name || item.scientific_name;
      currentStatus = item.isEnabled ? 'do_not_use' : 'use';
      return {
        ...item,
        isEnabled: !item.isEnabled
      };
    }
  });
  dispatch(toggleSpeciesUse(speciesName, currentStatus, committedSpecies));
  speciesSelectorStorageService.saveSelectedSpecies(committedSpecies);
};

export const deleteSpecies = createAction(
  'species_selector/delete_species',
  (resolve) => {
    return (speciesName: string, committedSpecies: CommittedItem[]) => {
      return resolve(
        committedSpecies,
        buildAnalyticsObject({
          category: 'selected_Species',
          label: speciesName,
          action: 'unselected'
        })
      );
    };
  }
);

export const deleteSpeciesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => (dispatch, getState) => {
  let speciesName = '';
  const committedSpecies = getCommittedSpecies(getState()).filter((item) => {
    if (item.genome_id === genomeId) {
      speciesName = item.common_name || item.scientific_name;
      return false;
    }
    return true;
  });

  dispatch(deleteSpecies(speciesName, committedSpecies));
  speciesSelectorStorageService.saveSelectedSpecies(committedSpecies);
};

export const changeAssembly = createAction(
  'species_selector/change_assembly',
  (resolve) => {
    return (assembly: Assembly) => {
      return resolve(
        assembly,
        buildAnalyticsObject({
          category: 'assembly_selector',
          label: assembly.assembly_name,
          action: 'select'
        })
      );
    };
  }
);
