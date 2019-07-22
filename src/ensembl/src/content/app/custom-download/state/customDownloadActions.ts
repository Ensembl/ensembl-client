import { createAction, createAsyncAction } from 'typesafe-actions';

import * as allFilterAccordionActions from '../containers/content/filter-accordion/state/filterAccordionActions';
import * as allAttributeAccordionActions from '../containers/content/attributes-accordion/state/attributesAccordionActions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import apiService from 'src/services/api-service';

import Preview from 'src/content/app/custom-download/types/Preview';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

export const filterAccordionActions = allFilterAccordionActions;
export const attributesAccordionActions = allAttributeAccordionActions;

export const updateSelectedPreFilter = createAction(
  'custom-download/update-selected-pre-filters',
  (resolve) => {
    return (selectedPreFilter: string) => resolve(selectedPreFilter);
  }
);

export const togglePreFiltersPanel = createAction(
  'custom-download/toggle-pre-filters-panel',
  (resolve) => {
    return (showPreFiltersPanel: boolean) => {
      customDownloadStorageService.saveShowPreFilterPanel(showPreFiltersPanel);
      return resolve(showPreFiltersPanel);
    };
  }
);

export const toggleTab = createAction(
  'custom-download/toggle-data-filter-tab-button',
  (resolve) => {
    return (selectedTab: string) => {
      customDownloadStorageService.saveSelectedTab(selectedTab);
      return resolve(selectedTab);
    };
  }
);

export const setPreviewResult = createAsyncAction(
  'custom-download/preview-results-request',
  'custom-download/preview-results-success',
  'custom-download/preview-results-failure'
)<{ endpointURL: string; headers: {} }, { preview: Preview }, Error>();

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
    return (showPreview: boolean) => {
      customDownloadStorageService.saveShowPreview(showPreview);
      return resolve(showPreview);
    };
  }
);

export const setDownloadType = createAction(
  'custom-download/set-download-as',
  (resolve) => {
    return (downloadType: string) => resolve(downloadType);
  }
);
