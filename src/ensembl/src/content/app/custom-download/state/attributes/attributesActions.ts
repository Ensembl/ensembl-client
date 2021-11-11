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

import { createAsyncAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Action } from 'redux';
import findIndex from 'lodash/findIndex';
import set from 'lodash/fp/set';

import { orthologueSpecies as sampleOrthologueSpecies } from 'src/content/app/custom-download/sample-data/orthologue';
import attributes from 'src/content/app/custom-download/sample-data/attributes';
import { updateActiveConfigurationForGenome } from 'src/content/app/custom-download/state/customDownloadActions';

import {
  Attributes,
  AttributeWithOptions
} from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import Species from 'src/content/app/custom-download/types/Species';
import { RootState } from 'src/store';

import {
  getCustomDownloadActiveGenomeId,
  getCustomDownloadActiveGenomeConfiguration
} from 'src/content/app/custom-download/state/customDownloadSelectors';

export const setAttributes = createAsyncAction(
  'custom-download/set-attributes-request',
  'custom-download/set-attributes-success',
  'custom-download/set-attributes-failure'
)<undefined, Attributes, Error>();

export const fetchAttributes: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  try {
    dispatch(setAttributes.request());

    // FIXME: Attributes are currently retrieved locally from a sample data file
    dispatch(setAttributes.success(attributes));
    dispatch(
      updateActiveConfigurationForGenome({
        activeGenomeId,
        data: set(
          'attributes.content',
          attributes,
          getCustomDownloadActiveGenomeConfiguration(getState())
        )
      })
    );
  } catch (error) {
    dispatch(setAttributes.failure(error as Error));
  }
};

export const updateSelectedAttributes: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (selectedAttributes: JSONValue) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'attributes.selectedAttributes',
        selectedAttributes,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
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
      data: set(
        'attributes.selectedAttributes',
        {},
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
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
      data: set(
        'attributes.ui',
        attributesUi,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};

export const setOrthologueAttributes: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> =
  (orthologues: { [key: string]: AttributeWithOptions }) =>
  (dispatch, getState: () => RootState) => {
    const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

    dispatch(
      updateActiveConfigurationForGenome({
        activeGenomeId,
        data: set(
          'attributes.content.orthologueAttributes.orthologues',
          orthologues,
          getCustomDownloadActiveGenomeConfiguration(getState())
        )
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
      data: set(
        'attributes.content.orthologue.showBestMatches',
        showBestMatches,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
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
      data: set(
        'attributes.content.orthologue.showAll',
        showAll,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
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
      data: set(
        'attributes.content.orthologue.applyToAllSpecies',
        applyToAllSpecies,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
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
      data: set(
        'attributes.content.orthologue.searchTerm',
        searchTerm,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};

export const setOrthologueSpecies = createAsyncAction(
  'custom-download/set-orthologue-species-request',
  'custom-download/set-orthologue-species-success',
  'custom-download/set-orthologue-species-failure'
)<{ searchTerm: string }, void, Error>();

export const updateOrthologueSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> =
  (orthologueSpecies: CheckboxGridOption[]) =>
  (dispatch, getState: () => RootState) => {
    const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

    dispatch(
      updateActiveConfigurationForGenome({
        activeGenomeId,
        data: set(
          'attributes.content.orthologue.species',
          orthologueSpecies,
          getCustomDownloadActiveGenomeConfiguration(getState())
        )
      })
    );
  };

export const fetchOrthologueSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> =
  (searchTerm: string, orthologueSpecies: CheckboxGridOption[]) =>
  (dispatch, getState: () => RootState) => {
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
          species.display_name
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1
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
          data: set(
            'attributes.content.orthologue.species',
            filteredSpecies,
            getCustomDownloadActiveGenomeConfiguration(getState())
          )
        })
      );
    } catch (error) {
      dispatch(setOrthologueSpecies.failure(error as Error));
    }
  };

export const setAttributesAccordionExpandedPanel: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (expandedPanels: string[]) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'attributes.expandedPanels',
        expandedPanels,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};
