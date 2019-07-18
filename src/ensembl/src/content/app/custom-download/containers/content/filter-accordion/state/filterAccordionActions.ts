import { createAction, createStandardAction } from 'typesafe-actions';

import { getCustomDownloadAnalyticsObject } from 'src/analyticsHelper';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

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
    return (filters: {}) => {
      customDownloadStorageService.saveSelectedFilters(filters);
      return resolve(
        filters,
        getCustomDownloadAnalyticsObject('Gene source filters updated')
      );
    };
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
