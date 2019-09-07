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
import { getActiveGenomePreviouslyViewedObjects } from './trackPanelSelectors';

import analyticsTracking from 'src/services/analytics-service';
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

export const updatePreviouslyViewedObjectsAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const activeEnsObject = getBrowserActiveEnsObject(state);
  if (!activeGenomeId || !activeEnsObject) {
    return;
  }
  const trackStates = getBrowserTrackStates(state)[activeGenomeId];

  const previouslyViewedObjects = [
    ...getActiveGenomePreviouslyViewedObjects(state)
  ];

  const existingIndex = previouslyViewedObjects.findIndex(
    (previouslyViewedObject) =>
      previouslyViewedObject.object_id === activeEnsObject.object_id
  );
  if (existingIndex === -1) {
    // IF it is not present, add it to the end
    previouslyViewedObjects.push(
      {
        genome_id: activeEnsObject.genome_id,
        object_id: activeEnsObject.object_id,
        object_type: activeEnsObject.object_type,
        label: activeEnsObject.label,
        location: { ...activeEnsObject.location },
        trackStates: { ...trackStates }
      }
    );
  } else {
    // If it is already present, bump it to the end
    const [previouslyViewedObject] = previouslyViewedObjects.splice(existingIndex, 1);
    previouslyViewedObjects.push(previouslyViewedObject);
  }

  // Limit the number of bookmark entries to 20
  const limitedPreviouslyViewedObjects = previouslyViewedObjects.slice(
    -20
  );

  trackPanelStorageService.updatePreviouslyViewedObjects({
    [activeGenomeId]: limitedPreviouslyViewedObjects
  });

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(state),
        previouslyViewedObjects: limitedPreviouslyViewedObjects
      }
    })
  );
};

export const changeHighlightedTrackId: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (highlightedTrackId: string) => (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeGenomeId = getBrowserActiveGenomeId(state);

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(state),
        highlightedTrackId
      }
    })
  );
};

export const openTrackPanelModal: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (trackPanelModalView: string) => (dispatch, getState: () => RootState) => {
  const state = getState();

  const activeGenomeId = getBrowserActiveGenomeId(state);

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(state),
        isTrackPanelModalOpened: true,
        trackPanelModalView
      }
    })
  );
};

export const closeTrackPanelModal: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeGenomeId = getBrowserActiveGenomeId(state);

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateTrackPanelForGenome({
      activeGenomeId,
      data: {
        ...getActiveTrackPanel(state),
        isTrackPanelModalOpened: false,
        trackPanelModalView: ''
      }
    })
  );
};
