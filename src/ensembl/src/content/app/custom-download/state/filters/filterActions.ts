import { createAction, createStandardAction } from 'typesafe-actions';

import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';
import JSONValue from 'src/shared/types/JSON';

export const setFiltersAccordionExpandedPanel = createAction(
  'custom-download/set-filters-accordion-expanded-panels',
  (resolve) => {
    return (expandedPanel: string) => resolve(expandedPanel);
  }
);

export const updateSelectedFilters = createAction(
  'custom-download/update-selected-filters',
  (resolve) => {
    return (filters: JSONValue) => {
      customDownloadStorageService.saveSelectedFilters(filters);
      return resolve(filters);
    };
  }
);

export const updateUi = createStandardAction(
  'custom-download/update-filter-content-state'
)<JSONValue>();

export const resetSelectedFilters = createStandardAction(
  'custom-download/reset-selected-filters'
)();
