import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Action } from 'redux';

import JSONValue from 'src/shared/types/JSON';
import { updateActiveConfigurationForGenome } from '../customDownloadActions';
import {
  getCustomDownloadActiveGenomeConfiguration,
  getCustomDownloadActiveGenomeId
} from '../customDownloadSelectors';
import set from 'lodash/set';
import { RootState } from 'src/store';

export const setFiltersAccordionExpandedPanel: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (expandedPanel: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'filters.expandedPanel',
          expandedPanel
        )
      }
    })
  );
};

export const updateSelectedFilters: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (selectedFilters: JSONValue) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'filters.selectedFilters',
          selectedFilters
        )
      }
    })
  );
};

export const updateUi: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (filtersUi: JSONValue) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'filters.ui',
          filtersUi
        )
      }
    })
  );
};

export const resetSelectedFilters: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: {
        ...set(
          getCustomDownloadActiveGenomeConfiguration(getState()),
          'filters.selectedFilters',
          {}
        )
      }
    })
  );
};
