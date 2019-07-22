import {
  createAction,
  createStandardAction,
  createAsyncAction
} from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Action } from 'redux';
import { orthologueSpecies as sampleOrthologueSpecies } from '../../../../sample-data/orthologue';

import attributes from 'src/content/app/custom-download/sample-data/attributes';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

import findIndex from 'lodash/findIndex';
import get from 'lodash/get';

import Attribute, {
  Attributes
} from 'src/content/app/custom-download/types/Attributes';

export const setAttributes = createAsyncAction(
  'custom-download/set-attributes-request',
  'custom-download/set-attributes-success',
  'custom-download/set-attributes-failure'
)<undefined, {}, Error>();

export const fetchAttributes: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => async (dispatch) => {
  try {
    dispatch(setAttributes.request());

    dispatch(setAttributes.success(attributes));
  } catch (error) {
    dispatch(setAttributes.failure(error));
  }
};

export const updateSelectedAttributes = createAction(
  'custom-download/update-selected-attributes',
  (resolve) => {
    return (attributes: Attributes) => {
      customDownloadStorageService.saveSelectedAttributes(attributes);
      return resolve(attributes);
    };
  }
);

export const resetSelectedAttributes = createStandardAction(
  'custom-download/reset-selected-attributes'
)();

export const updateContentState = createStandardAction(
  'custom-download/update-attribute-content-state'
)<Attributes>();

export const setOrthologueAttributes = createStandardAction(
  'custom-download/set-orthologue-attributes'
)<Attributes>();

export const setOrthologueShowBestMatches = createStandardAction(
  'custom-download/set-orthologue-show-best-matches'
)<boolean>();

export const setOrthologueShowAll = createStandardAction(
  'custom-download/set-orthologue-show-all'
)<boolean>();

export const setOrthologueApplyToAllSpecies = createStandardAction(
  'custom-download/set-orthologue-apply-to-all-species'
)<boolean>();

export const setOrthologueSearchTerm = createStandardAction(
  'custom-download/set-orthologue-search-term'
)<string>();

export const setOrthologueSpecies = createAsyncAction(
  'custom-download/set-orthologue-species-request',
  'custom-download/set-orthologue-species-success',
  'custom-download/set-orthologue-species-failure'
)<{ searchTerm: string }, {}, Error>();

export const fetchOrthologueSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (searchTerm: string, orthologueSpecies: any) => async (dispatch) => {
  dispatch(setOrthologueSpecies.request({ searchTerm: searchTerm }));
  try {
    // This will be fetched from the API when we have one
    let allSpecies = sampleOrthologueSpecies.species;

    let filteredSpecies: any = [...orthologueSpecies].filter((species) => {
      return species.isChecked;
    });

    allSpecies.forEach((species: any) => {
      if (
        searchTerm &&
        species.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
          -1
      ) {
        const speciesIndex = findIndex(
          orthologueSpecies,
          (entry: Attribute) => {
            return species.name === entry.id;
          }
        );

        const checkedStatus = get(
          orthologueSpecies,
          [speciesIndex, 'isChecked'],
          false
        );

        if (speciesIndex === -1 || checkedStatus) {
          filteredSpecies.push({
            id: species.name,
            label: species.display_name,
            isChecked: checkedStatus
          });
        }
      }
    });

    dispatch(setOrthologueSpecies.success(filteredSpecies));
  } catch (error) {
    dispatch(setOrthologueSpecies.failure(error));
  }
};

export const setAttributesAccordionExpandedPanel = createStandardAction(
  'custom-download/set-attributes-accordion-expanded-panels'
)<string>();
