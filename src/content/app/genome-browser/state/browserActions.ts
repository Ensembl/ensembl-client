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
import { Dispatch, ActionCreator, Action } from 'redux';
import { replace } from 'connected-react-router';
import { ThunkAction } from 'redux-thunk';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getChrLocationStr } from '../helpers/browserHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import browserStorageService from '../services/browser-storage-service';
import trackPanelStorageService from 'src/content/app/genome-browser/components/track-panel/services/track-panel-storage-service';

import { fetchEnsObject } from 'src/shared/state/focus-object/focusObjectSlice';
import { ensureSpeciesIsEnabled } from 'src/content/app/species-selector/state/speciesSelectorSlice';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId,
  getBrowserTrackStates,
  getChrLocation,
  getBrowserActiveEnsObjectIds,
  getBrowserNavOpenState
} from './browserSelectors';

import { RootState } from 'src/store';
import { BrowserTrackStates } from '../components/track-panel/trackPanelConfig';
import {
  BrowserNavIconStates,
  ChrLocation,
  CogList,
  ChrLocations
} from './browserState';
import { TrackActivityStatus } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';

export type UpdateTrackStatesPayload = {
  genomeId: string;
  categoryName: string;
  trackId: string;
  status: TrackActivityStatus;
};

export type ParsedUrlPayload = {
  activeGenomeId: string;
  activeEnsObjectId: string | null;
  chrLocation: ChrLocation | null;
};

export const setDataFromUrl = createAction(
  'browser/set-data-from-url'
)<ParsedUrlPayload>();

export const setDataFromUrlAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (payload: ParsedUrlPayload) => (dispatch) => {
  dispatch(setDataFromUrl(payload));

  const { activeGenomeId, activeEnsObjectId, chrLocation } = payload;

  dispatch(ensureSpeciesIsEnabled(payload.activeGenomeId));
  browserStorageService.saveActiveGenomeId(payload.activeGenomeId);
  chrLocation &&
    browserStorageService.updateChrLocation({ [activeGenomeId]: chrLocation });

  if (activeEnsObjectId) {
    browserStorageService.updateActiveEnsObjectIds({
      [activeGenomeId]: activeEnsObjectId
    });
  }
};

export const setActiveGenomeId = createAction(
  'browser/set-active-genome-id'
)<string>();

export const fetchDataForLastVisitedObjects: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => async (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeEnsObjectIdsMap = getBrowserActiveEnsObjectIds(state);
  Object.values(activeEnsObjectIdsMap).forEach((objectId) =>
    dispatch(fetchEnsObject(objectId))
  );
};

export const updateBrowserActiveEnsObjectIds = createAction(
  'browser/update-active-ens-object-ids'
)<{ [objectId: string]: string }>();

export const updateBrowserActiveEnsObjectIdsAndSave = (
  activeEnsObjectId: string
): ThunkAction<void, any, null, Action<string>> => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }
    const currentActiveEnsObjectIds = getBrowserActiveEnsObjectIds(state);
    const updatedActiveEnsObjectIds = {
      ...currentActiveEnsObjectIds,
      [activeGenomeId]: activeEnsObjectId
    };

    dispatch(updateBrowserActiveEnsObjectIds(updatedActiveEnsObjectIds));
    dispatch(fetchEnsObject(activeEnsObjectId));

    browserStorageService.updateActiveEnsObjectIds(updatedActiveEnsObjectIds);
  };
};

export const updateDefaultPositionFlag = createAction(
  'browser/update-default-position-flag'
)<boolean>();

export const updateTrackStates = createAction(
  'browser/update-tracks-state'
)<BrowserTrackStates>();

export const updateTrackStatesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (payload: BrowserTrackStates) => (dispatch, getState: () => RootState) => {
  dispatch(updateTrackStates(payload));
  const trackStates = getBrowserTrackStates(getState());
  browserStorageService.saveTrackStates(trackStates);
};

export const openBrowserNav = createAction('browser/open-browser-navigation')<{
  activeGenomeId: string;
}>();

export const closeBrowserNav = createAction(
  'browser/close-browser-navigation'
)<{ activeGenomeId: string }>();

export const toggleBrowserNav: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = () => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const isBrowserNavOpenState = getBrowserNavOpenState(state);
    const activeGenomeId = getBrowserActiveGenomeId(state);

    if (!activeGenomeId) {
      return;
    }
    if (isBrowserNavOpenState) {
      dispatch(closeBrowserNav({ activeGenomeId }));
    } else {
      dispatch(openBrowserNav({ activeGenomeId }));
    }
  };
};

export const updateBrowserNavIconStates = createAction(
  'browser/update-browser-nav-states'
)<{ activeGenomeId: string; navStates: BrowserNavIconStates }>();

export const updateChrLocation = createAction(
  'browser/update-chromosome-location'
)<ChrLocations>();

export const updateActualChrLocation = createAction(
  'browser/update-actual-chromosome-location'
)<ChrLocations>();

export const setActualChrLocation: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = (chrLocation: ChrLocation) => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }
    const payload = {
      [activeGenomeId]: chrLocation
    };

    dispatch(updateActualChrLocation(payload));
  };
};

export const setChrLocation: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = (chrLocation: ChrLocation) => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    const activeEnsObjectId = getBrowserActiveEnsObjectId(state);
    const savedChrLocation = getChrLocation(state);
    if (!activeGenomeId || !activeEnsObjectId) {
      return;
    }
    const payload = {
      [activeGenomeId]: chrLocation
    };

    dispatch(updateChrLocation(payload));
    browserStorageService.updateChrLocation(payload);

    if (!isEqual(chrLocation, savedChrLocation)) {
      const newUrl = urlFor.browser({
        genomeId: activeGenomeId,
        focus: buildFocusIdForUrl(activeEnsObjectId),
        location: getChrLocationStr(chrLocation)
      });
      dispatch(replace(newUrl));
    }
  };
};

export const updateCogList = createAction('browser/update-cog-list')<number>();

export const updateCogTrackList = createAction(
  'browser/update-cog-track-list'
)<CogList>();

export const updateSelectedCog = createAction('browser/update-selected-cog')<
  string | null
>();

export const updateTrackConfigNames = createAction(
  'browser/update-track-config-names',
  (selectedCog: string, sense: boolean) =>
    [selectedCog, sense] as [string, boolean]
)();

export const updateTrackConfigLabel = createAction(
  'browser/update-track-config-label',
  (selectedCog: string, sense: boolean) =>
    [selectedCog, sense] as [string, boolean]
)();

export const updateApplyToAll = createAction(
  'browser/update-apply-to-all'
)<boolean>();

export const updateApplyToAllTrackNames = createAction(
  'browser/update-apply-to-all-track-names'
)<boolean>();

export const updateApplyToAllTrackLabels = createAction(
  'browser/update-apply-to-all-track-labels'
)<boolean>();

export const toggleRegionEditorActive = createAction(
  'browser/toggle-region-editor-active'
)<boolean>();

export const toggleRegionFieldActive = createAction(
  'browser/toggle-region-field-active'
)<boolean>();

export const deleteGenome = createAction('browser/delete-genome')<string>();

export const deleteSpeciesInGenomeBrowser = (
  genomeIdToRemove: string
): ThunkAction<void, any, null, Action<string>> => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();

    dispatch(deleteGenome(genomeIdToRemove));

    const updatedActiveEnsObjectIds = pickBy(
      getBrowserActiveEnsObjectIds(state),
      (value, key) => key !== genomeIdToRemove
    );

    dispatch(updateBrowserActiveEnsObjectIds(updatedActiveEnsObjectIds));

    browserStorageService.deleteGenome(genomeIdToRemove);
    trackPanelStorageService.deleteGenome(genomeIdToRemove);
  };
};
