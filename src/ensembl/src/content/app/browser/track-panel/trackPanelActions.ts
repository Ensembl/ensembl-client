import { createAction, createStandardAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator } from 'redux';
import uniq from 'lodash/uniq';

import { RootState } from 'src/store';
import { TrackSet } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import { getBrowserActiveGenomeId } from '../browserSelectors';
import analyticsTracking from 'src/services/analytics-service';
import { getActiveTrackPanel } from './trackPanelSelectors';
import {
  pickPersistentTrackPanelProperties,
  TrackPanelStateForGenome
} from './trackPanelState';

export const updateTrackPanelForGenome = createAction(
  'track-panel/update-track-panel',
  (action) => (payload: {
    activeGenomeId: string;
    data: Partial<TrackPanelStateForGenome>;
  }) => {
    const { activeGenomeId, data } = payload;
    const persistentTrackProperties = pickPersistentTrackPanelProperties(data);
    browserStorageService.updateTrackPanels({
      [activeGenomeId]: persistentTrackProperties
    });
    return action({ activeGenomeId, data });
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
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(getState()),
        isTrackPanelOpened
      }
    })
  );
};

export const selectTrackPanelTabAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (selectedTrackPanelTab: TrackSet) => (
  dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  browserStorageService.updateSelectedTrackPanelTab({
    [activeGenomeId]: selectedTrackPanelTab
  });

  analyticsTracking.trackEvent({
    category: 'track_panel_tab',
    label: selectedTrackPanelTab,
    action: 'selected'
  });

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(getState()),
        selectedTrackPanelTab,
        isTrackPanelModalOpened: false,
        trackPanelModalView: ''
      }
    })
  );
};

export const changeTrackPanelModalViewForGenome: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (trackPanelModalView: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }
  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(getState()),
        trackPanelModalView
      }
    })
  );
};

export const changeHighlightedTrackId: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (highlightedTrackId: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(getState()),
        highlightedTrackId
      }
    })
  );
};

export const openTrackPanelModal: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (trackPanelModalView: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(getState()),
        isTrackPanelModalOpened: true,
        trackPanelModalView
      }
    })
  );
};

export const closeTrackPanelModal: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(getState()),
        isTrackPanelModalOpened: false,
        trackPanelModalView: ''
      }
    })
  );
};

export const updateCollapsedTrackIds: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (payload: { trackId: string; isCollapsed: boolean }) => (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const trackPanel = getActiveTrackPanel(state);
  let { collapsedTrackIds } = trackPanel;

  if (!activeGenomeId) {
    return;
  }

  if (payload.isCollapsed) {
    collapsedTrackIds = uniq([...collapsedTrackIds, payload.trackId]);
  } else {
    collapsedTrackIds = collapsedTrackIds.filter(
      (id) => id !== payload.trackId
    );
  }

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        collapsedTrackIds
      }
    })
  );
};
