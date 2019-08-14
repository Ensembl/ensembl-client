import { createStandardAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator } from 'redux';

import { RootState } from 'src/store';
import { TrackSet } from './trackPanelConfig';
import trackPanelStorageService from './track-panel-storage-service';
import browserStorageService from '../browser-storage-service';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject,
  getBrowserTrackStates
} from '../browserSelectors';
import { getActiveGenomeBookmarks } from './trackPanelSelectors';

import { Bookmark } from './trackPanelState';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

const buildBookmarkLabel = (ensObject: EnsObject): string => {
  if (ensObject.object_type === 'gene') {
    return ensObject.label;
  }

  return ensObject.stable_id
    ? ensObject.stable_id
    : getFormattedLocation(ensObject.location);
};

import { getActiveTrackPanel } from './trackPanelSelectors';
import { TrackPanelStateForGenome } from './trackPanelState';

export const updateTrackPanelForGenome = createStandardAction(
  'track-panel/update-track-panel'
)<{ activeGenomeId: string; data: TrackPanelStateForGenome }>();

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

export const updateBookmarksAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const activeEnsObject = getBrowserActiveEnsObject(state);
  if (!activeGenomeId || !activeEnsObject) {
    return;
  }
  const trackStates = getBrowserTrackStates(state)[activeGenomeId];

  const activeGenomeBookmarks = [...getActiveGenomeBookmarks(getState())];

  const existingIndex = activeGenomeBookmarks.findIndex(
    (bookmark) => bookmark.object_id === activeEnsObject.object_id
  );
  if (existingIndex === -1) {
    // IF it is not present, add it to the end
    activeGenomeBookmarks.push({
      genome_id: activeEnsObject.genome_id,
      object_id: activeEnsObject.object_id,
      object_type: activeEnsObject.object_type,
      label: buildBookmarkLabel(activeEnsObject),
      location: { ...activeEnsObject.location },
      trackStates: { ...trackStates }
    });
  } else if (existingIndex !== -1) {
    // If it is already present, bump it to the end
    activeGenomeBookmarks.push({
      ...activeGenomeBookmarks[existingIndex],
      trackStates
    });
    activeGenomeBookmarks.splice(existingIndex, 1);
  }

  trackPanelStorageService.updateActiveGenomeBookmarks({
    [activeGenomeId]: activeGenomeBookmarks
  });

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(getState()),
        bookmarks: activeGenomeBookmarks
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
