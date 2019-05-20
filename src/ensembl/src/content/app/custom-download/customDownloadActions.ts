import { createAction } from 'typesafe-actions';

import { getCustomDownloadAnalyticsObject } from 'src/analyticsHelper';
import * as allFilterAccordionActions from './containers/content/filter-accordion/filterAccordionActions';
import * as allAttributeAccordionActions from './containers/content/attributes-accordion/attributesAccordionActions';

export const filterAccordionActions = allFilterAccordionActions;
export const attributesAccordionActions = allAttributeAccordionActions;

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
