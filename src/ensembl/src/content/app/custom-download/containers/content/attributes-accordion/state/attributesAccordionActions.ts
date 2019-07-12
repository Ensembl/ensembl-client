import { createAction, createAsyncAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Action } from 'redux';
import { getCustomDownloadAnalyticsObject } from 'src/analyticsHelper';
import { orthologueSpecies as sampleOrthologueSpecies } from '../../../../sample-data/orthologue';

import attributes from 'src/content/app/custom-download/sample-data/attributes';

import { Attributes } from 'src/content/app/custom-download/types/Attributes';

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
    return (attributes: Attributes) =>
      resolve(
        attributes,
        getCustomDownloadAnalyticsObject('Gene attributes updated')
      );
  }
);

export const updateContentState = createAction(
  'custom-download/update-content-state',
  (resolve) => {
    return (contentState: any) => resolve(contentState);
  }
);

export const setOrthologueAttributes = createAction(
  'custom-download/set-orthologue-attributes',
  (resolve) => {
    return (orthologueAttributes: Attributes) =>
      resolve(
        orthologueAttributes,
        getCustomDownloadAnalyticsObject('Orthologue attributes updated')
      );
  }
);

export const setOrthologueShowBestMatches = createAction(
  'custom-download/set-orthologue-show-best-matches',
  (resolve) => {
    return (showBestMatches: boolean) =>
      resolve(
        showBestMatches,
        getCustomDownloadAnalyticsObject(
          'Orthologue Show Best Matches link clicked'
        )
      );
  }
);

export const setOrthologueShowAll = createAction(
  'custom-download/set-orthologue-show-all',
  (resolve) => {
    return (showAll: boolean) =>
      resolve(
        showAll,
        getCustomDownloadAnalyticsObject('Orthologue Show All link clicked')
      );
  }
);

export const setOrthologueApplyToAllSpecies = createAction(
  'custom-download/set-orthologue-apply-to-all-species',
  (resolve) => {
    return (applyToAllSpecies: boolean) =>
      resolve(
        applyToAllSpecies,
        getCustomDownloadAnalyticsObject(
          'Orthologue Apply To All Species link clicked'
        )
      );
  }
);

export const setOrthologueSearchTerm = createAction(
  'custom-download/set-orthologue-search-term',
  (resolve) => {
    return (searchTerm: string) =>
      resolve(
        searchTerm,
        getCustomDownloadAnalyticsObject('Orthologue search term updated')
      );
  }
);

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

    let filteredSpecies: any = [];

    allSpecies.forEach((species: any) => {
      if (
        species.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
        -1
      ) {
        let checkedStatus = false;
        if (
          orthologueSpecies &&
          orthologueSpecies.default &&
          orthologueSpecies.default[species]
        ) {
          checkedStatus = true;
        }
        filteredSpecies.push({
          id: species.name,
          label: species.display_name,
          isChecked: checkedStatus
        });
      }
    });

    dispatch(setOrthologueSpecies.success({ default: filteredSpecies }));
  } catch (error) {
    dispatch(setOrthologueSpecies.failure(error));
  }
};

export const setAttributesAccordionExpandedPanel = createAction(
  'custom-download/set-attributes-accordion-expanded-panels',
  (resolve) => {
    return (expandedPanel: string) =>
      resolve(
        expandedPanel,
        getCustomDownloadAnalyticsObject('Toggle attributes accordion panel')
      );
  }
);
