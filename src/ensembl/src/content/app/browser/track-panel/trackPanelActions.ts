import { createAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator } from 'redux';
import { batch } from 'react-redux';

import { RootState } from 'src/store';
import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import { getBrowserActiveGenomeId } from '../browserSelectors';

export const toggleTrackPanelForGenome = createAction(
  'track-panel/toggle-track-panel',
  (resolve) => {
    return (isTrackPanelOpenedForGenome: {
      activeGenomeId: string;
      isTrackPanelOpened: boolean;
    }) => resolve(isTrackPanelOpenedForGenome);
  }
);

export const toggleTrackPanel: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (isTrackPanelOpened: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    toggleTrackPanelForGenome({
      activeGenomeId: activeGenomeId,
      isTrackPanelOpened
    })
  );
};

export const selectBrowserTab = createAction(
  'track-panel/select-browser-tab',
  (resolve) => {
    return (selectedBrowserTabForGenome: {
      activeGenomeId: string;
      selectedBrowserTab: TrackType;
    }) => {
      return resolve(selectedBrowserTabForGenome);
    };
  }
);

export const selectBrowserTabAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (selectedBrowserTab: TrackType) => (
  dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  browserStorageService.updateSelectedBrowserTab({
    [activeGenomeId]: selectedBrowserTab
  });

  batch(() => {
    dispatch(
      selectBrowserTab({
        activeGenomeId,
        selectedBrowserTab
      })
    );
    dispatch(closeTrackPanelModal());
  });
};

export const changeTrackPanelModalViewForGenome = createAction(
  'track-panel/change-track-panel-modal-view',
  (resolve) => {
    return (trackPanelModalViewForGenome: {
      activeGenomeId: string;
      trackPanelModalView: string;
    }) => resolve(trackPanelModalViewForGenome);
  }
);

export const toggleTrackPanelModalForGenome = createAction(
  'track-panel/toggle-track-panel-modal',
  (resolve) => {
    return (isTrackPanelModalOpenForGenome: {
      activeGenomeId: string;
      isTrackPanelModalOpened: boolean;
    }) => resolve(isTrackPanelModalOpenForGenome);
  }
);

export const openTrackPanelModal: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (trackPanelModalView: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  batch(() => {
    dispatch(
      toggleTrackPanelModalForGenome({
        activeGenomeId,
        isTrackPanelModalOpened: true
      })
    );

    dispatch(
      changeTrackPanelModalViewForGenome({
        activeGenomeId: activeGenomeId,
        trackPanelModalView
      })
    );
  });
};

export const closeTrackPanelModal: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  batch(() => {
    dispatch(
      toggleTrackPanelModalForGenome({
        activeGenomeId,
        isTrackPanelModalOpened: false
      })
    );

    dispatch(
      changeTrackPanelModalViewForGenome({
        activeGenomeId,
        trackPanelModalView: ''
      })
    );
  });
};
