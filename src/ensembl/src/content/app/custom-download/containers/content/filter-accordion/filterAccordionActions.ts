import { createAction } from 'typesafe-actions';

import { getCustomDownloadAnalyticsObject } from 'src/analyticsHelper';

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
