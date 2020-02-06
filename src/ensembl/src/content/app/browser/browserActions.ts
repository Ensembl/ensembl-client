import { createAction } from 'typesafe-actions';
import { Dispatch, ActionCreator, Action } from 'redux';
import { replace } from 'connected-react-router';
import { ThunkAction } from 'redux-thunk';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import config from 'config';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { getChrLocationStr } from './browserHelper';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import browserStorageService from './browser-storage-service';

import { fetchEnsObject } from 'src/shared/state/ens-object/ensObjectActions';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId,
  getBrowserTrackStates,
  getChrLocation,
  getBrowserMessageCount,
  getBrowserActiveEnsObjectIds
} from './browserSelectors';

import { updatePreviouslyViewedObjectsAndSave } from 'src/content/app/browser/track-panel/trackPanelActions';

import { RootState } from 'src/store';
import {
  BrowserTrackStates,
  TrackStates
} from './track-panel/trackPanelConfig';
import { BROWSER_CONTAINER_ID } from './browser-constants';

import {
  BrowserNavStates,
  ChrLocation,
  CogList,
  ChrLocations
} from './browserState';
import { TrackActivityStatus } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { Status } from 'src/shared/types/status';

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

export const updateBrowserActivated = createAction(
  'browser/update-browser-activated'
)<boolean>();

export const activateBrowser = () => {
  return (dispatch: Dispatch) => {
    const { protocol, host: currentHost } = location;
    const host = config.apiHost || currentHost;

    const payload = {
      'config-url': `${protocol}${host}/browser/config`,
      key: 'main', // TODO: remove this field after we confirmed that it is redundant
      selector: `#${BROWSER_CONTAINER_ID}`
    };
    browserMessagingService.send('bpane-activate', payload);

    dispatch(updateBrowserActivated(true));
  };
};

export const setDataFromUrl = createAction('browser/set-data-from-url')<
  ParsedUrlPayload
>();

export const setDataFromUrlAndSave: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (payload: ParsedUrlPayload) => (dispatch) => {
  dispatch(setDataFromUrl(payload));

  const { activeGenomeId, activeEnsObjectId, chrLocation } = payload;

  browserStorageService.saveActiveGenomeId(payload.activeGenomeId);
  chrLocation &&
    browserStorageService.updateChrLocation({ [activeGenomeId]: chrLocation });

  if (activeEnsObjectId) {
    browserStorageService.updateActiveEnsObjectIds({
      [activeGenomeId]: activeEnsObjectId
    });
  }
};

export const fetchDataForLastVisitedObjects: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = () => async (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeEnsObjectIdsMap = getBrowserActiveEnsObjectIds(state);
  const activeEnsObjectIds = Object.values(activeEnsObjectIdsMap);
  activeEnsObjectIds.forEach((id) => dispatch(fetchEnsObject(id)));
};

export const updateBrowserActiveEnsObjectIds = createAction(
  'browser/update-active-ens-object-ids'
)<{ [objectId: string]: string }>();

export const updateBrowserActiveEnsObjectIdsAndSave: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (activeEnsObjectId: string) => {
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

export const updateTrackStates = createAction('browser/update-tracks-state')<
  BrowserTrackStates
>();

export const updateTrackStatesAndSave: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (payload: BrowserTrackStates) => (dispatch, getState: () => RootState) => {
  dispatch(updateTrackStates(payload));
  const trackStates = getBrowserTrackStates(getState());
  browserStorageService.saveTrackStates(trackStates);
};

export const restoreBrowserTrackStates: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = () => (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const activeEnsObjectId = getBrowserActiveEnsObjectId(state);

  if (!activeGenomeId || !activeEnsObjectId) {
    return;
  }

  const trackStatesFromStorage = browserStorageService.getTrackStates();
  const mergedTrackStates = {
    ...get(
      trackStatesFromStorage,
      `${activeGenomeId}.objectTracks.${activeEnsObjectId}`
    ),
    ...get(trackStatesFromStorage, `${activeGenomeId}.commonTracks`)
  } as TrackStates;

  const tracksToTurnOff: string[] = [];
  const tracksToTurnOn: string[] = [];

  Object.values(mergedTrackStates).forEach((trackStates) => {
    Object.keys(trackStates).forEach((trackId) => {
      trackStates[trackId] === Status.SELECTED
        ? tracksToTurnOn.push(trackId)
        : tracksToTurnOff.push(trackId);
    });
  });

  browserMessagingService.send('bpane', {
    off: tracksToTurnOff,
    on: tracksToTurnOn
  });
};

export const toggleBrowserNav = createAction(
  'browser/toggle-browser-navigation'
)();

export const updateBrowserNavStates = createAction(
  'browser/update-browser-nav-states'
)<BrowserNavStates>();

export const updateChrLocation = createAction(
  'browser/update-chromosome-location'
)<ChrLocations>();

export const updateActualChrLocation = createAction(
  'browser/update-actual-chromosome-location'
)<ChrLocations>();

export const setActualChrLocation: ActionCreator<ThunkAction<
  any,
  any,
  null,
  Action<string>
>> = (chrLocation: ChrLocation) => {
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

export const setChrLocation: ActionCreator<ThunkAction<
  any,
  any,
  null,
  Action<string>
>> = (chrLocation: ChrLocation) => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    const activeEnsObjectId = getBrowserActiveEnsObjectId(state);
    const savedChrLocation = getChrLocation(state);
    if (!activeGenomeId) {
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
        focus: activeEnsObjectId,
        location: getChrLocationStr(chrLocation)
      });
      dispatch(replace(newUrl));
    }
  };
};

export const updateMessageCounter = createAction(
  'browser/update-message-counter'
)<number>();

export const changeBrowserLocation: ActionCreator<ThunkAction<
  any,
  any,
  null,
  Action<string>
>> = (locationData: {
  genomeId: string;
  ensObjectId: string | null;
  chrLocation: ChrLocation;
}) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const [chrCode, startBp, endBp] = locationData.chrLocation;

    const activeEnsObjectId =
      locationData.ensObjectId || getBrowserActiveEnsObjectId(state);

    const messageCount = getBrowserMessageCount(state);
    const focusInstruction = activeEnsObjectId
      ? {
          focus: activeEnsObjectId
        }
      : {};

    browserMessagingService.send('bpane', {
      stick: `${locationData.genomeId}:${chrCode}`,
      goto: `${startBp}-${endBp}`,
      'message-counter': messageCount,
      ...focusInstruction
    });
  };
};

export const changeFocusObject: ActionCreator<ThunkAction<
  any,
  any,
  null,
  Action<string>
>> = (objectId) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const messageCount = getBrowserMessageCount(state);

    dispatch(updatePreviouslyViewedObjectsAndSave());

    browserMessagingService.send('bpane', {
      focus: objectId,
      'message-counter': messageCount
    });
  };
};

export const updateCogList = createAction('browser/update-cog-list')<number>();

export const updateCogTrackList = createAction('browser/update-cog-track-list')<
  CogList
>();

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

export const updateApplyToAll = createAction('browser/update-apply-to-all')<
  boolean
>();

export const toggleRegionEditorActive = createAction(
  'browser/toggle-region-editor-active'
)<boolean>();

export const toggleRegionFieldActive = createAction(
  'browser/toggle-region-field-active'
)<boolean>();
