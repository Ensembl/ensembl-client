import { createAction } from 'typesafe-actions';

import { getCustomDownloadAnalyticsObject } from 'src/analyticsHelper';

export const setAttributes = createAction(
  'custom-download/set-attributes',
  (resolve) => {
    return (attributes: {}) =>
      resolve(attributes, getCustomDownloadAnalyticsObject('Default action'));
  }
);

export const setGeneAttributes = createAction(
  'custom-download/set-gene-attributes',
  (resolve) => {
    return (geneAttributes: {}) =>
      resolve(
        geneAttributes,
        getCustomDownloadAnalyticsObject('Gene attributes updated')
      );
  }
);

export const setTranscriptAttributes = createAction(
  'custom-download/set-transcript-attributes',
  (resolve) => {
    return (transcriptAttributes: {}) =>
      resolve(
        transcriptAttributes,
        getCustomDownloadAnalyticsObject('Transctipt attributes updated')
      );
  }
);

export const setOrthologueAttributes = createAction(
  'custom-download/set-orthologue-attributes',
  (resolve) => {
    return (orthologueAttributes: {}) =>
      resolve(
        orthologueAttributes,
        getCustomDownloadAnalyticsObject('Orthologue attributes updated')
      );
  }
);

export const setOrthologueFilteredSpecies = createAction(
  'custom-download/set-orthologue-filteres-species',
  (resolve) => {
    return (filteredSpecies: {}) =>
      resolve(
        filteredSpecies,
        getCustomDownloadAnalyticsObject('Orthologue species filtered')
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

export const setOrthologueSpecies = createAction(
  'custom-download/set-orthologue-species',
  (resolve) => {
    return (allSpecies: []) =>
      resolve(
        allSpecies,
        getCustomDownloadAnalyticsObject('Orthologue species updated')
      );
  }
);

export const setLocationAttributes = createAction(
  'custom-download/set-location-attributes',
  (resolve) => {
    return (locationAttributes: {}) =>
      resolve(
        locationAttributes,
        getCustomDownloadAnalyticsObject('Location attributes updated')
      );
  }
);

export const setSomaticVariationAttributes = createAction(
  'custom-download/set-somatic-variation-attributes',
  (resolve) => {
    return (variationAttributes: {}) =>
      resolve(
        variationAttributes,
        getCustomDownloadAnalyticsObject('Somatic variation attributes updated')
      );
  }
);

export const setGermlineVariationAttributes = createAction(
  'custom-download/set-germline-variation-attributes',
  (resolve) => {
    return (variationAttributes: {}) =>
      resolve(
        variationAttributes,
        getCustomDownloadAnalyticsObject(
          'Germline variation attributes updated'
        )
      );
  }
);

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

export const setVariationAccordionExpandedPanels = createAction(
  'custom-download/set-variation-attributes-accordion-expanded-panels',
  (resolve) => {
    return (expandedPanels: []) =>
      resolve(
        expandedPanels,
        getCustomDownloadAnalyticsObject(
          'Toggle variation attributes accordion panel'
        )
      );
  }
);
