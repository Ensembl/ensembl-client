import { createAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator } from 'redux';

import { RootState } from 'src/store';
import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import { getBrowserActiveGenomeId } from '../browserSelectors';
import { batch } from 'react-redux';

export const toggleTrackPanelForGenome = createAction(
  'track-panel/toggle-track-panel',
  (resolve) => {
    return (isTrackPanelOpenedForGenome: { [genomeId: string]: boolean }) =>
      resolve(isTrackPanelOpenedForGenome);
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
      [activeGenomeId]: isTrackPanelOpened
    })
  );
};

export const selectBrowserTab = createAction(
  'track-panel/select-browser-tab',
  (resolve) => {
    return (selectedBrowserTabForGenome: { [genomeId: string]: TrackType }) => {
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

  const selectedBrowserTabForGenome = {
    [activeGenomeId]: selectedBrowserTab
  };

  browserStorageService.updateSelectedBrowserTab(selectedBrowserTabForGenome);

  batch(() => {
    dispatch(selectBrowserTab(selectedBrowserTabForGenome));
    dispatch(closeTrackPanelModal());
  });
};

export const changeTrackPanelModalViewForGenome = createAction(
  'track-panel/change-track-panel-modal-view',
  (resolve) => {
    return (trackPanelModalView: { [genomeId: string]: string }) =>
      resolve(trackPanelModalView);
  }
);

export const toggleTrackPanelModalForGenome = createAction(
  'track-panel/toggle-track-panel-modal',
  (resolve) => {
    return (isTrackPanelModalOpenForGenome: { [genomeId: string]: boolean }) =>
      resolve(isTrackPanelModalOpenForGenome);
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
        [activeGenomeId]: true
      })
    );

    dispatch(
      changeTrackPanelModalViewForGenome({
        [activeGenomeId]: trackPanelModalView
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
        [activeGenomeId]: false
      })
    );

    dispatch(
      changeTrackPanelModalViewForGenome({
        [activeGenomeId]: ''
      })
    );
  });
};
