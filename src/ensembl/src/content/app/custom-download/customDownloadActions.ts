import { createAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

import { getCustomDownloadAnalyticsObject } from 'src/analyticsHelper';

export const updateSelectedPreFilter = createAction(
  'custom-download/update-selected-pre-filters',
  (resolve) => {
    return (selectedPreFilter: string) =>
      resolve(
        selectedPreFilter,
        getCustomDownloadAnalyticsObject('Pre Filter Updates')
      );
  }
);

export const togglePreFiltersPanel = createAction(
  'custom-download/toggle-pre-filters-panel',
  (resolve) => {
    return (showPreFiltersPanel: boolean) =>
      resolve(
        showPreFiltersPanel,
        getCustomDownloadAnalyticsObject('Pre Filter Panel Toggled')
      );
  }
);

export const toggleTabButton = createAction(
  'custom-download/toggle-data-filter-tab-button',
  (resolve) => {
    return (selectedTabButton: string) =>
      resolve(
        selectedTabButton,
        getCustomDownloadAnalyticsObject('Toggle Data/Filter Tab Button')
      );
  }
);

export const setAttributes = createAction(
  'custom-download/set-attributes',
  (resolve) => {
    return (attributes: {}) =>
      resolve(attributes, getCustomDownloadAnalyticsObject('Default action'));
  }
);

export const setPreviewResult = createAction(
  'custom-download/set-preview-results',
  (resolve) => {
    return (previewResult: {}) =>
      resolve(
        previewResult,
        getCustomDownloadAnalyticsObject('Default action')
      );
  }
);

export const setIsLoadingResult = createAction(
  'custom-download/set-loading-result',
  (resolve) => {
    return (isLoading: boolean) => resolve(isLoading);
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

export const setFiltersAccordionExpandedPanel = createAction(
  'custom-download/set-filters-accordion-expanded-panels',
  (resolve) => {
    return (expandedPanel: string) =>
      resolve(
        expandedPanel,
        getCustomDownloadAnalyticsObject('Toggle filters accordion panel')
      );
  }
);

export const setFiltersAccordionExpandedGenePanels = createAction(
  'custom-download/set-filters-accordion-expanded-gene-panels',
  (resolve) => {
    return (expandedPanels: []) =>
      resolve(
        expandedPanels,
        getCustomDownloadAnalyticsObject('Toggle filters accordion gene panels')
      );
  }
);

export const setGeneFilters = createAction(
  'custom-download/set-gene-filters',
  (resolve) => {
    return (geneFilters: {}) =>
      resolve(
        geneFilters,
        getCustomDownloadAnalyticsObject('Gene filters updated')
      );
  }
);

export const setGeneTypeFilters = createAction(
  'custom-download/set-gene-type-filters',
  (resolve) => {
    return (geneTypeFilters: {}) =>
      resolve(
        geneTypeFilters,
        getCustomDownloadAnalyticsObject('Gene type filters updated')
      );
  }
);

export const setTranscriptTypeFilters = createAction(
  'custom-download/set-transcript-type-filters',
  (resolve) => {
    return (transcriptTypeFilters: {}) =>
      resolve(
        transcriptTypeFilters,
        getCustomDownloadAnalyticsObject('Transcript type filters updated')
      );
  }
);
