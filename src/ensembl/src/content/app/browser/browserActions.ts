import { createAction, createStandardAction } from 'typesafe-actions';
import { Dispatch, ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import config from 'config';

import {
  BrowserNavStates,
  ChrLocation,
  CogList,
  ChrLocations
} from './browserState';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectIds,
  getBrowserTrackStates
} from './browserSelectors';
import browserStorageService from './browser-storage-service';
import { RootState } from 'src/store';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';
import { TrackStates } from './track-panel/trackPanelConfig';

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

export const activateBrowser = (browserEl: HTMLDivElement) => {
  return (dispatch: Dispatch) => {
    const { protocol, host: currentHost } = location;
    const host = config.apiHost || currentHost;
    const activateEvent = new CustomEvent('bpane-activate', {
      bubbles: true,
      detail: {
        'config-url': `${protocol}${host}/browser/config`,
        key: 'main'
      }
    });

    browserEl.dispatchEvent(activateEvent);

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
  activeEnsObjectId &&
    browserStorageService.updateActiveEnsObjectIds({
      [activeGenomeId]: activeEnsObjectId
    });
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
  return (dispatch: Dispatch, getState: () => RootState) => {
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

    browserStorageService.updateActiveEnsObjectIds(updatedActiveEnsObjectId);
  };
};

export const updateTrackStates = createStandardAction(
  'browser/update-tracks-state'
)<TrackStates>();

export const updateTrackStatesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (payload: UpdateTrackStatesPayload) => (
  dispatch: Dispatch,
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

export const setChrLocation: ActionCreator<
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

    dispatch(updateChrLocation(payload));
    browserStorageService.updateChrLocation(payload);
  };
};

export const changeBrowserLocation: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = (genomeId: string, chrLocation: ChrLocation, browserEl: HTMLDivElement) => {
  return () => {
    const [chrCode, startBp, endBp] = chrLocation;

    const stickEvent = new CustomEvent('bpane', {
      bubbles: true,
      detail: {
        stick: `${genomeId}:${chrCode}`
      }
    });

    browserEl.dispatchEvent(stickEvent);

    if (startBp > 0 && endBp > 0) {
      const gotoEvent = new CustomEvent('bpane', {
        bubbles: true,
        detail: {
          goto: `${startBp}-${endBp}`
        }
      });

      browserEl.dispatchEvent(gotoEvent);
    }
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
)<string>();

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
