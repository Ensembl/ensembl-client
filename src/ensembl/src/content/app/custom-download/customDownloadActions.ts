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

export const setGeneAttributes = createAction(
  'custom-download/set-gene-attributes',
  (resolve) => {
    return (geneAttributes: {}) =>
      resolve(
        geneAttributes,
        getCustomDownloadAnalyticsObject('Default action')
      );
  }
);
