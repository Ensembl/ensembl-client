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
