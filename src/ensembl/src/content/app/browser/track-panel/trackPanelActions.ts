/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import uniq from 'lodash/uniq';

import { RootState } from 'src/store';
import { TrackSet } from './trackPanelConfig';
import trackPanelStorageService from './track-panel-storage-service';
import browserStorageService from '../browser-storage-service';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject
} from '../browserSelectors';
import { getActiveGenomePreviouslyViewedObjects } from './trackPanelSelectors';

import analyticsTracking from 'src/services/analytics-service';
import { getActiveTrackPanel } from './trackPanelSelectors';
import {
  pickPersistentTrackPanelProperties,
  TrackPanelStateForGenome
} from './trackPanelState';

export const updateTrackPanelForGenome = createAction(
  'track-panel/update-track-panel',
  (payload: {
    activeGenomeId: string;
    data: Partial<TrackPanelStateForGenome>;
  }) => {
    const { activeGenomeId, data } = payload;
    const persistentTrackProperties = pickPersistentTrackPanelProperties(data);
    browserStorageService.updateTrackPanels({
      [activeGenomeId]: persistentTrackProperties
    });
    return { activeGenomeId, data };
  }
)();

export const toggleTrackPanel =
  (isTrackPanelOpened: boolean): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

export const selectTrackPanelTab =
  (
    selectedTrackPanelTab: TrackSet
  ): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const activeGenomeId = getBrowserActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

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

export const changeTrackPanelModalViewForGenome =
  (trackPanelModalView: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

export const updatePreviouslyViewedObjectsAndSave =
  (): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    const activeEnsObject = getBrowserActiveEnsObject(state);
    if (!activeGenomeId || !activeEnsObject) {
      return;
    }

    const previouslyViewedObjects = [
      ...getActiveGenomePreviouslyViewedObjects(state)
    ];

    const savedEntitiesWithoutCurrentEntity =
      previouslyViewedObjects?.filter(
        (entity) => entity.object_id !== activeEnsObject.object_id
      ) || [];

    const versioned_stable_id =
      activeEnsObject.type === 'gene'
        ? activeEnsObject.versioned_stable_id
        : null;

    const geneSymbol =
      activeEnsObject.type === 'gene' &&
      activeEnsObject.label !== activeEnsObject.stable_id
        ? activeEnsObject.label
        : null;

    const label =
      activeEnsObject.type === 'gene'
        ? ([geneSymbol, versioned_stable_id].filter(Boolean) as string[])
        : activeEnsObject.label;

    const newObject = {
      genome_id: activeEnsObject.genome_id,
      object_id: activeEnsObject.object_id,
      type: activeEnsObject.type,
      label: label
    };

    const updatedEntitiesArray = [
      newObject,
      ...savedEntitiesWithoutCurrentEntity
    ];

    // Limit the total number of previously viewed objects to 250
    const limitedPreviouslyViewedObjects = updatedEntitiesArray.slice(-250);

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

export const changeHighlightedTrackId =
  (highlightedTrackId: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

export const openTrackPanelModal =
  (trackPanelModalView: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

export const closeTrackPanelModal =
  (): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

export const updateCollapsedTrackIds =
  (payload: {
    trackId: string;
    isCollapsed: boolean;
  }): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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
