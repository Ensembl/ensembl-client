import { createAction } from 'typesafe-actions';

export const setFiltersAccordionExpandedPanel = createAction(
  'custom-download/set-filters-accordion-expanded-panels',
  (resolve) => {
    return (expandedPanel: string) => resolve(expandedPanel);
  }
);

export const setFiltersAccordionExpandedGenePanels = createAction(
  'custom-download/set-filters-accordion-expanded-gene-panels',
  (resolve) => {
    return (expandedPanels: []) => resolve(expandedPanels);
  }
);

export const setGencodeAnnotationFilters = createAction(
  'custom-download/set-gencode-basic-annotation-filters',
  (resolve) => {
    return (gencodeBasicAnnotation: string) => resolve(gencodeBasicAnnotation);
  }
);

export const setGeneSourceFilters = createAction(
  'custom-download/set-gene-sourcefilters',
  (resolve) => {
    return (geneSource: {}) => resolve(geneSource);
  }
);

export const setGeneTypeFilters = createAction(
  'custom-download/set-gene-type-filters',
  (resolve) => {
    return (geneTypeFilters: {}) => resolve(geneTypeFilters);
  }
);

export const setTranscriptTypeFilters = createAction(
  'custom-download/set-transcript-type-filters',
  (resolve) => {
    return (transcriptTypeFilters: {}) => resolve(transcriptTypeFilters);
  }
);
