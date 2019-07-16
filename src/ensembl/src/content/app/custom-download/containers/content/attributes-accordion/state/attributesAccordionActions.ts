import { createAction, createAsyncAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Action } from 'redux';
import buildAnalyticsObject from 'src/analyticsHelper';
import {
  attributes,
  orthologueSpecies as sampleOrthologueSpecies
} from '../../../../sampledata';
import AttributesSection from 'src/content/app/custom-download/types/Attributes';

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

export const setGeneAttributes = createAction(
  'custom-download/set-gene-attributes',
  (resolve) => {
    return (geneAttributes: AttributesSection) =>
      resolve(
        geneAttributes,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Gene attributes updated'
        })
      );
  }
);

export const setTranscriptAttributes = createAction(
  'custom-download/set-transcript-attributes',
  (resolve) => {
    return (transcriptAttributes: AttributesSection) =>
      resolve(
        transcriptAttributes,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Transctipt attributes updated'
        })
      );
  }
);

export const setPhenotypeAttributes = createAction(
  'custom-download/set-phenotype-attributes',
  (resolve) => {
    return (phenotypeAttributes: AttributesSection) =>
      resolve(
        phenotypeAttributes,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Phenotype attributes updated'
        })
      );
  }
);

export const setOrthologueAttributes = createAction(
  'custom-download/set-orthologue-attributes',
  (resolve) => {
    return (orthologueAttributes: AttributesSection) =>
      resolve(
        orthologueAttributes,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Orthologue attributes updated'
        })
      );
  }
);

export const setOrthologueShowBestMatches = createAction(
  'custom-download/set-orthologue-show-best-matches',
  (resolve) => {
    return (showBestMatches: boolean) =>
      resolve(
        showBestMatches,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Orthologue Show Best Matches link clicked'
        })
      );
  }
);

export const setOrthologueShowAll = createAction(
  'custom-download/set-orthologue-show-all',
  (resolve) => {
    return (showAll: boolean) =>
      resolve(
        showAll,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Orthologue Show All link clicked'
        })
      );
  }
);

export const setOrthologueApplyToAllSpecies = createAction(
  'custom-download/set-orthologue-apply-to-all-species',
  (resolve) => {
    return (applyToAllSpecies: boolean) =>
      resolve(
        applyToAllSpecies,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Orthologue Apply To All Species link clicked'
        })
      );
  }
);

export const setOrthologueSearchTerm = createAction(
  'custom-download/set-orthologue-search-term',
  (resolve) => {
    return (searchTerm: string) =>
      resolve(
        searchTerm,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Orthologue search term updated'
        })
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

    let filteredSpecies: any = {};

    allSpecies.forEach((species: any) => {
      if (
        species.display_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
        -1
      ) {
        filteredSpecies[species.name] = {
          id: species.name,
          label: species.display_name,
          isChecked: false
        };
      }
    });

    if (orthologueSpecies && orthologueSpecies.default) {
      Object.keys(orthologueSpecies.default).forEach((species: string) => {
        if (orthologueSpecies.default[species].isChecked) {
          filteredSpecies[species] = orthologueSpecies.default[species];
        }
      });
    }

    dispatch(setOrthologueSpecies.success({ default: filteredSpecies }));
  } catch (error) {
    dispatch(setOrthologueSpecies.failure(error));
  }
};

export const setLocationAttributes = createAction(
  'custom-download/set-location-attributes',
  (resolve) => {
    return (locationAttributes: AttributesSection) =>
      resolve(
        locationAttributes,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Location attributes updated'
        })
      );
  }
);

export const setSomaticVariationAttributes = createAction(
  'custom-download/set-somatic-variation-attributes',
  (resolve) => {
    return (variationAttributes: AttributesSection) =>
      resolve(
        variationAttributes,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Somatic variation attributes updated'
        })
      );
  }
);

export const setGermlineVariationAttributes = createAction(
  'custom-download/set-germline-variation-attributes',
  (resolve) => {
    return (variationAttributes: AttributesSection) =>
      resolve(
        variationAttributes,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Germline variation attributes updated'
        })
      );
  }
);

export const setAttributesAccordionExpandedPanel = createAction(
  'custom-download/set-attributes-accordion-expanded-panels',
  (resolve) => {
    return (expandedPanel: string) =>
      resolve(
        expandedPanel,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Toggle attributes accordion panel'
        })
      );
  }
);

export const setVariationAccordionExpandedPanels = createAction(
  'custom-download/set-variation-attributes-accordion-expanded-panels',
  (resolve) => {
    return (expandedPanels: string[]) =>
      resolve(
        expandedPanels,
        buildAnalyticsObject({
          category: 'Custom downloads',
          label: 'Toggle variation attributes accordion panel'
        })
      );
  }
);
