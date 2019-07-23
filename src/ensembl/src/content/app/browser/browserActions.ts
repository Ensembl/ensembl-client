import { createAction, createStandardAction } from 'typesafe-actions';
import { Dispatch, ActionCreator, Action } from 'redux';
import { replace } from 'connected-react-router';
import { ThunkAction } from 'redux-thunk';
import isEqual from 'lodash/isEqual';

import config from 'config';
import * as urlFor from 'src/shared/helpers/urlHelper';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import { BrowserNavStates, ChrLocation, CogList } from './browserState';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId,
  getBrowserActiveEnsObjectIds,
  getBrowserTrackStates,
  getChrLocation,
  getBrowserMessageCount
} from './browserSelectors';
import { getBrowserAnalyticsObject } from 'src/analyticsHelper';
import { getChrLocationStr } from './browserHelper';
import browserStorageService from './browser-storage-service';
import { RootState } from 'src/store';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';
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

export const updateBrowserActivated = createAction(
  'browser/update-browser-activated',
  (resolve) => {
    return (browserActivated: boolean) =>
      resolve(browserActivated, getBrowserAnalyticsObject('Default Action'));
  }
);

export const activateBrowser = (browserEl: HTMLDivElement) => {
  return (dispatch: Dispatch) => {
    const { protocol, host: currentHost } = location;
    const host = config.apiHost || currentHost;

    const payload = {
      'config-url': `${protocol}${host}/browser/config`,
      key: 'main',
      selector: `#${BROWSER_CONTAINER_ID}`
    };
    browserMessagingService.send('bpane-activate', payload);

    dispatch(updateBrowserActivated(true));
  };
};

export const setDataFromUrl = createAction(
  'browser/set-data-from-url',
  (resolve) => {
    return (payload: ParsedUrlPayload) =>
      resolve(payload, getBrowserAnalyticsObject('Navigation'));
  }
);

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

export const updateBrowserActiveGenomeId = createAction(
  'browser/update-active-genome-id',
  (resolve) => {
    return (activeGenomeId: string) =>
      resolve(activeGenomeId, getBrowserAnalyticsObject('Navigation'));
  }
);

export const updateBrowserActiveGenomeIdAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (activeGenomeId: string) => (dispatch) => {
  dispatch(updateBrowserActiveGenomeId(activeGenomeId));
  browserStorageService.saveActiveGenomeId(activeGenomeId);
};

export const updateBrowserActiveEnsObjectIds = createAction(
  'browser/update-active-ens-object-ids',
  (resolve) => {
    return (activeEnsObjectId: { [objectId: string]: string }) =>
      resolve(activeEnsObjectId, getBrowserAnalyticsObject('Navigation'));
  }
);

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

export const toggleBrowserNav = createAction(
  'browser/toggle-browser-navigation',
  (resolve) => {
    return () => resolve(undefined, getBrowserAnalyticsObject('Navigation'));
  }
);

export const updateBrowserNavStates = createAction(
  'browser/update-browser-nav-states',
  (resolve) => {
    return (browserNavStates: BrowserNavStates) =>
      resolve(browserNavStates, getBrowserAnalyticsObject('Navigation'));
  }
);

export const updateChrLocation = createAction(
  'browser/update-chromosome-location',
  (resolve) => {
    return (chrLocationData: { [genomeId: string]: ChrLocation }) =>
      resolve(chrLocationData);
  }
);

export const updateActualChrLocation = createStandardAction(
  'browser/update-actual-chromosome-location'
)<{ [genomeId: string]: ChrLocation }>();

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
    const messageCount = getBrowserMessageCount(state);

    browserMessagingService.send('bpane', {
      stick: `${genomeId}:${chrCode}`,
      'message-counter': messageCount
    });

    browserMessagingService.send('bpane', {
      goto: `${startBp}-${endBp}`,
      'message-counter': messageCount
    });
  };
};

export const changeFocusObject: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = (objectId) => {
  return (dispatch, getState: () => RootState) => {
    console.log('in changeFocusObject');
    const state = getState();
    const messageCount = getBrowserMessageCount(state);

    browserMessagingService.send('bpane', {
      focus: objectId,
      'message-counter': messageCount
    });
  };
};

export const updateCogList = createAction(
  'browser/update-cog-list',
  (resolve) => {
    return (cogList: number) => {
      return resolve(cogList, getBrowserAnalyticsObject('User Interaction'));
    };
  }
);

export const updateCogTrackList = createAction(
  'browser/update-cog-track-list',
  (resolve) => {
    return (trackY: CogList) => {
      return resolve(trackY, getBrowserAnalyticsObject('User Interaction'));
    };
  }
);

export const updateSelectedCog = createAction(
  'browser/update-selected-cog',
  (resolve) => {
    return (index: string) => {
      return resolve(index, getBrowserAnalyticsObject('User Interaction'));
    };
  }
);

export const updateTrackConfigNames = createAction(
  'browser/update-track-config-names',
  (resolve) => {
    return (selectedCog: any, sense: boolean) => {
      return resolve(
        [selectedCog, sense],
        getBrowserAnalyticsObject('User Interaction')
      );
    };
  }
);

export const updateTrackConfigLabel = createAction(
  'browser/update-track-config-label',
  (resolve) => {
    return (selectedCog: any, sense: boolean) => {
      return resolve(
        [selectedCog, sense],
        getBrowserAnalyticsObject('User Interaction')
      );
    };
  }
);

export const updateApplyToAll = createAction(
  'browser/update-apply-to-all',
  (resolve) => {
    return (yn: boolean) => {
      return resolve(yn, getBrowserAnalyticsObject('User Interaction'));
    };
  }
);

export const toggleGenomeSelector = createAction(
  'toggle-genome-selector',
  (resolve) => {
    return (genomeSelectorActive: boolean) =>
      resolve(
        genomeSelectorActive,
        getBrowserAnalyticsObject('User Interaction')
      );
  }
);
