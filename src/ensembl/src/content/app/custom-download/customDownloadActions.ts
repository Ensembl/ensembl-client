import { createAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

import { getCustomDownloadAnalyticsObject } from 'src/analyticsHelper';

export const updateSelectedPreFilters = createAction(
  'custom-download/update-selected-pre-filters',
  (resolve) => {
    return (preFilterStatuses: {}) =>
      resolve(
        preFilterStatuses,
        getCustomDownloadAnalyticsObject('Pre Filters Updates')
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
