import { createAsyncAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Action } from 'redux';
import { orthologueSpecies as sampleOrthologueSpecies } from 'src/content/app/custom-download/sample-data/orthologue';

import attributes from 'src/content/app/custom-download/sample-data/attributes';

import findIndex from 'lodash/findIndex';

import { AttributeWithOptions } from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import Species from 'src/content/app/custom-download/types/Species';
import {
  getCustomDownloadActiveGenomeId,
  getCustomDownloadActiveGenomeConfiguration
} from '../customDownloadSelectors';
import set from 'lodash/set';
import { updateActiveConfigurationForGenome } from '../customDownloadActions';
import { RootState } from 'src/store';

export const setAttributes = createAsyncAction(
  'custom-download/set-attributes-request',
  'custom-download/set-attributes-success',
  'custom-download/set-attributes-failure'
)<undefined, {}, Error>();

export const fetchAttributes: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  try {
    dispatch(setAttributes.request());

    dispatch(setAttributes.success(attributes));
    dispatch(
      updateActiveConfigurationForGenome({
        activeGenomeId,
        data: {
          ...set(
            getCustomDownloadActiveGenomeConfiguration(getState()),
            'attributes.content',
            attributes
          )
        }
      })
    );
  } catch (error) {
    dispatch(setAttributes.failure(error));
  }
};

export const updateSelectedAttributes: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (selectedAttributes: JSONValue) => (
  dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'attributes.selectedAttributes',
          selectedAttributes
        )
      }
    })
  );
};

export const resetSelectedAttributes: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'attributes.selectedAttributes',
          {}
        )
      }
    })
  );
};

export const updateUi: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (attributesUi: JSONValue) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'attributes.ui',
          attributesUi
        )
      }
    })
  );
};

export const setOrthologueAttributes: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (orthologues: { [key: string]: AttributeWithOptions }) => (
  dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'attributes.content.orthologueAttributes.orthologues',
          orthologues
        )
      }
    })
  );
};

export const setOrthologueShowBestMatches: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (showBestMatches: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'attributes.content.orthologue.showBestMatches',
          showBestMatches
        )
      }
    })
  );
};

export const setOrthologueShowAll: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (showAll: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'attributes.content.orthologue.showAll',
          showAll
        )
      }
    })
  );
};

export const setOrthologueApplyToAllSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (applyToAllSpecies: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'attributes.content.orthologue.applyToAllSpecies',
          applyToAllSpecies
        )
      }
    })
  );
};

export const setOrthologueSearchTerm: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (searchTerm: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'attributes.content.orthologue.searchTerm',
          searchTerm
        )
      }
    })
  );
};

export const setOrthologueSpecies = createAsyncAction(
  'custom-download/set-orthologue-species-request',
  'custom-download/set-orthologue-species-success',
  'custom-download/set-orthologue-species-failure'
)<{ searchTerm: string }, undefined, Error>();

export const fetchOrthologueSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (searchTerm: string, orthologueSpecies: CheckboxGridOption[]) => (
  dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(setOrthologueSpecies.request({ searchTerm: searchTerm }));
  try {
    // This will be fetched from the API when we have one
    const allSpecies = sampleOrthologueSpecies.species as Species[];

    const filteredSpecies: CheckboxGridOption[] = orthologueSpecies.filter(
      (species: CheckboxGridOption) => {
        return species.isChecked;
      }
    );

    allSpecies.forEach((species: Species) => {
      if (
        searchTerm &&
        species.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
          -1
      ) {
        const speciesIndex = findIndex(
          filteredSpecies,
          (entry: CheckboxGridOption) => {
            return species.name === entry.id;
          }
        );

        if (speciesIndex === -1) {
          filteredSpecies.push({
            id: species.name,
            label: species.display_name,
            isChecked: false
          });
        }
      }
    });

    dispatch(setOrthologueSpecies.success());
    dispatch(
      updateActiveConfigurationForGenome({
        activeGenomeId,
        data: {
          ...set(
            getCustomDownloadActiveGenomeConfiguration(getState()),
            'attributes.content.orthologue.species',
            filteredSpecies
          )
        }
      })
    );
  } catch (error) {
    dispatch(setOrthologueSpecies.failure(error));
  }
};

export const setAttributesAccordionExpandedPanel: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (expandedPanel: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'attributes.expandedPanel',
          expandedPanel
        )
      }
    })
  );
};
