import { createAction, createStandardAction } from 'typesafe-actions';

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

export const updateSelectedFilters = createAction(
  'custom-download/update-selected-filters',
  (resolve) => {
    return (filters: {}) =>
      resolve(
        filters,
        getCustomDownloadAnalyticsObject('Gene source filters updated')
      );
  }
);

export const updateContentState = createAction(
  'custom-download/update-filter-content-state',
  (resolve) => {
    return (contentState: {}) => resolve(contentState);
  }
);

export const resetSelectedFilters = createStandardAction(
  'custom-download/reset-selected-filters'
)();
