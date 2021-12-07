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

import { PayloadAction } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { createSlice } from '@reduxjs/toolkit';
import { Action } from 'redux';
import uniq from 'lodash/uniq';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';

import trackPanelStorageService from 'src/content/app/genome-browser/components/track-panel/services/track-panel-storage-service';
import browserStorageService from 'src/content/app/genome-browser/services/browser-storage-service';
import analyticsTracking from 'src/services/analytics-service';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject
} from 'src/content/app/genome-browser/state/browser-entity/browserEntitySelectors';
import { getActiveGenomePreviouslyViewedObjects } from './trackPanelSelectors';
import { getActiveTrackPanel } from './trackPanelSelectors';

import { ParsedUrlPayload } from 'src/content/app/genome-browser/state/browser-entity/browserEntitySlice';
import { TrackSet } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { RootState } from 'src/store';

export type PreviouslyViewedObject = {
  genome_id: string;
  object_id: string;
  type: string;
  label: string | string[];
};

export type PreviouslyViewedObjects = {
  [genomeId: string]: PreviouslyViewedObject[];
};

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
  trackPanelModalView: string;
  bookmarks: PreviouslyViewedObject[];
  previouslyViewedObjects: PreviouslyViewedObject[];
  highlightedTrackId: string;
  collapsedTrackIds: string[];
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  isTrackPanelModalOpened: false,
  bookmarks: [],
  previouslyViewedObjects: [],
  selectedTrackPanelTab: TrackSet.GENOMIC,
  trackPanelModalView: '',
  highlightedTrackId: '',
  isTrackPanelOpened: true,
  collapsedTrackIds: []
};

export const getTrackPanelState = (): TrackPanelState => {
  const genomeId = browserStorageService.getActiveGenomeId();
  return genomeId ? { [genomeId]: getTrackPanelStateForGenome(genomeId) } : {};
};

export const getTrackPanelStateForGenome = (
  genomeId: string
): TrackPanelStateForGenome => {
  return genomeId
    ? {
        ...defaultTrackPanelStateForGenome,
        ...getPersistentTrackPanelStateForGenome(genomeId)
      }
    : defaultTrackPanelStateForGenome;
};

export const getPersistentTrackPanelStateForGenome = (
  genomeId: string
): Partial<TrackPanelStateForGenome> =>
  browserStorageService.getTrackPanels()[genomeId] || {};

export const pickPersistentTrackPanelProperties = (
  trackPanel: Partial<TrackPanelStateForGenome>
) => {
  const persistentProperties = ['collapsedTrackIds', 'previouslyViewedObjects'];
  return pick(trackPanel, persistentProperties);
};

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

    const isCurrentEntityPreviouslyViewed = previouslyViewedObjects.some(
      (entity) => entity.object_id === activeEnsObject.object_id
    );

    if (isCurrentEntityPreviouslyViewed) {
      return;
    }

    const stable_id =
      activeEnsObject.type === 'gene'
        ? activeEnsObject.versioned_stable_id || activeEnsObject.stable_id
        : null;

    const geneSymbol =
      activeEnsObject.type === 'gene' &&
      activeEnsObject.label !== activeEnsObject.stable_id
        ? activeEnsObject.label
        : null;

    const label =
      activeEnsObject.type === 'gene' && geneSymbol
        ? [geneSymbol, stable_id as string]
        : activeEnsObject.label;

    const newObject = {
      genome_id: activeEnsObject.genome_id,
      object_id: activeEnsObject.object_id,
      type: activeEnsObject.type,
      label: label
    };

    const updatedEntitiesArray = [newObject, ...previouslyViewedObjects];

    // Limit the total number of previously viewed objects to 250
    const previouslyViewedObjectsSlice = updatedEntitiesArray.slice(-250);

    trackPanelStorageService.updatePreviouslyViewedObjects({
      [activeGenomeId]: previouslyViewedObjectsSlice
    });

    dispatch(
      updateTrackPanelForGenome({
        activeGenomeId,
        data: {
          ...getActiveTrackPanel(state),
          previouslyViewedObjects: previouslyViewedObjectsSlice
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

const browserTrackPanelSlice = createSlice({
  name: 'genome-browser-track-panel',
  initialState: getTrackPanelState() as TrackPanelState,
  reducers: {
    setTrackPanelDataFromUrl(state, action: PayloadAction<ParsedUrlPayload>) {
      const { activeGenomeId } = action.payload;
      if (!state[activeGenomeId]) {
        state.activeGenomeId = getTrackPanelStateForGenome(activeGenomeId);
      }
    },
    updateTrackPanelForGenome(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
        data: Partial<TrackPanelStateForGenome>;
      }>
    ) {
      const { activeGenomeId, data } = action.payload;
      const persistentTrackProperties =
        pickPersistentTrackPanelProperties(data);
      browserStorageService.updateTrackPanels({
        [activeGenomeId]: persistentTrackProperties
      });

      state[activeGenomeId] = {
        ...state[activeGenomeId],
        ...action.payload.data
      };
    },
    deleteGenomeTrackPanelData(state, action: PayloadAction<string>) {
      state = pickBy(state, (value, key) => key !== action.payload);
    }
  }
});

export const {
  setTrackPanelDataFromUrl,
  updateTrackPanelForGenome,
  deleteGenomeTrackPanelData
} = browserTrackPanelSlice.actions;

export default browserTrackPanelSlice.reducer;
