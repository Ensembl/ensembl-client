import { createAction, createStandardAction } from 'typesafe-actions';
import { Dispatch, ActionCreator, Action } from 'redux';
import { replace } from 'connected-react-router';
import { ThunkAction } from 'redux-thunk';
import isEqual from 'lodash/isEqual';

import config from 'config';
import * as urlFor from 'src/shared/helpers/urlHelper';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

import { fetchEnsObject } from 'src/ens-object/ensObjectActions';

import {
  BrowserNavStates,
  ChrLocation,
  CogList,
  ChrLocations
} from './browserState';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId,
  getBrowserTrackStates,
  getChrLocation,
  getBrowserMessageCount,
  getBrowserActiveEnsObjectIds
} from './browserSelectors';

import { updatePreviouslyViewedObjectsAndSave } from 'src/content/app/browser/track-panel/trackPanelActions';

import { getChrLocationStr } from './browserHelper';
import browserStorageService from './browser-storage-service';
import { RootState } from 'src/store';
import { ImageButtonStatus } from 'src/shared/components/image-button/ImageButton';
import { TrackStates } from './track-panel/trackPanelConfig';
import { BROWSER_CONTAINER_ID } from './browser-constants';

export type UpdateTrackStatesPayload = {
  genomeId: string;
  categoryName: string;
  trackId: string;
  status: ImageButtonStatus; // TODO: update types so that actions do not depend on ImageButton types
};

export type ParsedUrlPayload = {
  activeGenomeId: string;
  activeEnsObjectId: string | null;
  chrLocation: ChrLocation | null;
};

export const updateBrowserActivated = createStandardAction(
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

export const setDataFromUrl = createStandardAction('browser/set-data-from-url')<
  ParsedUrlPayload
>();

export const setDataFromUrlAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (payload: ParsedUrlPayload) => (dispatch) => {
  dispatch(setDataFromUrl(payload));

  const { activeGenomeId, activeEnsObjectId, chrLocation } = payload;

  browserStorageService.saveActiveGenomeId(payload.activeGenomeId);
  chrLocation &&
    browserStorageService.updateChrLocation({ [activeGenomeId]: chrLocation });

  if (activeEnsObjectId) {
    browserStorageService.updateActiveEnsObjectIds({
      [activeGenomeId]: activeEnsObjectId
    });

    dispatch(updatePreviouslyViewedObjectsAndSave());
  }
};

export const updateBrowserActiveGenomeId = createStandardAction(
  'browser/update-active-genome-id'
)<string>();

export const updateBrowserActiveGenomeIdAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (activeGenomeId: string) => (dispatch) => {
  dispatch(updateBrowserActiveGenomeId(activeGenomeId));
  browserStorageService.saveActiveGenomeId(activeGenomeId);
};

export const updateBrowserActiveEnsObjectIds = createStandardAction(
  'browser/update-active-ens-object-ids'
)<{ [objectId: string]: string }>();

export const updateBrowserActiveEnsObjectIdsAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (activeEnsObjectId: string) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }
    const currentActiveEnsObjectIds = getBrowserActiveEnsObjectIds(state);
    const updatedActiveEnsObjectId = {
      ...currentActiveEnsObjectIds,
      [activeGenomeId]: activeEnsObjectId
    };

    dispatch(updateBrowserActiveEnsObjectIds(updatedActiveEnsObjectId));
    dispatch(fetchEnsObject(activeEnsObjectId));

    browserStorageService.updateActiveEnsObjectIds(updatedActiveEnsObjectId);
  };
};

export const updateTrackStates = createStandardAction(
  'browser/update-tracks-state'
)<TrackStates>();

export const updateTrackStatesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (payload: UpdateTrackStatesPayload) => (
  dispatch,
  getState: () => RootState
) => {
  const stateFragment = {
    [payload.genomeId]: {
      [payload.categoryName]: {
        [payload.trackId]: payload.status
      }
    }
  };

  dispatch(updateTrackStates(stateFragment));
  dispatch(updatePreviouslyViewedObjectsAndSave());
  const trackStates = getBrowserTrackStates(getState());
  browserStorageService.saveTrackStates(trackStates);
};

export const toggleBrowserNav = createStandardAction(
  'browser/toggle-browser-navigation'
)();

export const updateBrowserNavStates = createStandardAction(
  'browser/update-browser-nav-states'
)<BrowserNavStates>();

export const updateChrLocation = createStandardAction(
  'browser/update-chromosome-location'
)<ChrLocations>();

export const updateActualChrLocation = createStandardAction(
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

export const updateMessageCounter = createStandardAction(
  'browser/update-message-counter'
)<number>();

export const changeBrowserLocation: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = (genomeId: string, chrLocation: ChrLocation) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const [chrCode, startBp, endBp] = chrLocation;
    const activeEnsObjectId = getBrowserActiveEnsObjectId(state);
    const messageCount = getBrowserMessageCount(state);
    const focusInstruction = activeEnsObjectId
      ? {
          focus: activeEnsObjectId
        }
      : {};

    browserMessagingService.send('bpane', {
      stick: `${genomeId}:${chrCode}`,
      goto: `${startBp}-${endBp}`,
      'message-counter': messageCount,
      ...focusInstruction
    });
  };
};

export const changeFocusObject: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = (objectId) => {
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

export const updateCogList = createStandardAction('browser/update-cog-list')<
  number
>();

export const updateCogTrackList = createStandardAction(
  'browser/update-cog-track-list'
)<CogList>();

export const updateSelectedCog = createStandardAction(
  'browser/update-selected-cog'
)<string | null>();

export const updateTrackConfigNames = createAction(
  'browser/update-track-config-names',
  (resolve) => {
    return (selectedCog: any, sense: boolean) => {
      return resolve([selectedCog, sense]);
    };
  }
);

export const updateTrackConfigLabel = createAction(
  'browser/update-track-config-label',
  (resolve) => {
    return (selectedCog: any, sense: boolean) => {
      return resolve([selectedCog, sense]);
    };
  }
);

export const updateApplyToAll = createStandardAction(
  'browser/update-apply-to-all'
)<boolean>();

export const toggleGenomeSelector = createStandardAction(
  'toggle-genome-selector'
)<boolean>();
