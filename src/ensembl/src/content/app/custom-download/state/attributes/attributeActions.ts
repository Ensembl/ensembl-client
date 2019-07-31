import {
  createAction,
  createStandardAction,
  createAsyncAction
} from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Action } from 'redux';
import { orthologueSpecies as sampleOrthologueSpecies } from 'src/content/app/custom-download/sample-data/orthologue';

import attributes from 'src/content/app/custom-download/sample-data/attributes';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

import findIndex from 'lodash/findIndex';

import { AttributeWithOptions } from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import Species from 'src/content/app/custom-download/types/Species';

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
    return (attributes: JSONValue) => {
      customDownloadStorageService.saveSelectedAttributes(attributes);
      return resolve(attributes);
    };
  }
);

export const resetSelectedAttributes = createStandardAction(
  'custom-download/reset-selected-attributes'
)();

export const updateUi = createStandardAction(
  'custom-download/update-attribute-content-state'
)<JSONValue>();

export const setOrthologueAttributes = createStandardAction(
  'custom-download/set-orthologue-attributes'
)<{ [key: string]: AttributeWithOptions }>();

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
)<{ searchTerm: string }, CheckboxGridOption[], Error>();

export const fetchOrthologueSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (searchTerm: string, orthologueSpecies: CheckboxGridOption[]) => async (
  dispatch
) => {
  dispatch(setOrthologueSpecies.request({ searchTerm: searchTerm }));
  try {
    // This will be fetched from the API when we have one
    let allSpecies = sampleOrthologueSpecies.species as Species[];

    let filteredSpecies: CheckboxGridOption[] = orthologueSpecies.filter(
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

    dispatch(setOrthologueSpecies.success(filteredSpecies));
  } catch (error) {
    dispatch(setOrthologueSpecies.failure(error));
  }
};

export const setAttributesAccordionExpandedPanel = createStandardAction(
  'custom-download/set-attributes-accordion-expanded-panels'
)<string>();
