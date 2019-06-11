import { createAction, createAsyncAction } from 'typesafe-actions';

import { getCustomDownloadAnalyticsObject } from 'src/analyticsHelper';
import * as allFilterAccordionActions from '../containers/content/filter-accordion/state/filterAccordionActions';
import * as allAttributeAccordionActions from '../containers/content/attributes-accordion/state/attributesAccordionActions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import apiService from 'src/services/api-service';

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

export const setPreviewResult = createAsyncAction(
  'custom-download/preview-results-request',
  'custom-download/preview-results-success',
  'custom-download/preview-results-failure'
)<{ endpointURL: string; headers: {} }, { preview: {} }, Error>();

export const fetchPreviewResult: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (endpointURL: string) => async (dispatch) => {
  try {
    apiService
      .fetch(endpointURL, {
        headers: {
          'Content-Type': 'application/json'
        },
        preserveEndpoint: true
      })
      .then((response: any) => {
        dispatch(setPreviewResult.success(response));
      });
  } catch (error) {
    dispatch(setPreviewResult.failure(error));
  }
};

export const setIsLoadingResult = createAction(
  'custom-download/set-loading-result',
  (resolve) => {
    return (isLoading: boolean) => resolve(isLoading);
  }
);

export const setShowPreview = createAction(
  'custom-download/set-show-preview',
  (resolve) => {
    return (showPreview: boolean) =>
      resolve(
        showPreview,
        getCustomDownloadAnalyticsObject('Show download preview')
      );
  }
);

export const setDownloadType = createAction(
  'custom-download/set-download-as',
  (resolve) => {
    return (downloadType: string) =>
      resolve(
        downloadType,
        getCustomDownloadAnalyticsObject('Download as ' + downloadType)
      );
  }
);
