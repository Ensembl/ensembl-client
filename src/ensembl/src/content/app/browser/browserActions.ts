import { createAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

import { BrowserNavStates, ChrLocation, CogList } from './browserState';
import { getBrowserAnalyticsObject } from 'src/analyticsHelper';

export const updateBrowserActivated = createAction(
  'browser/update-browser-activated',
  (resolve) => {
    return (browserActivated: boolean) =>
      resolve(browserActivated, getBrowserAnalyticsObject('Default Action'));
  }
);

export const activateBrowser = (browserEl: HTMLDivElement) => {
  return (dispatch: Dispatch) => {
    // protocol string to prepend apiHost url in case it isn't defined
    const { protocol, host } = location;
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
    return (chrLocation: ChrLocation) => resolve(chrLocation);
  }
);

export const updateDefaultChrLocation = createAction(
  'browser/update-default-chromosome-location',
  (resolve) => {
    return (chrLocation: ChrLocation) =>
      resolve(chrLocation, getBrowserAnalyticsObject('User Interaction'));
  }
);

export const changeBrowserLocation = (
  chrLocation: ChrLocation,
  browserEl: HTMLDivElement
) => {
  return (dispatch: Dispatch) => {
    const [chrCode, startBp, endBp] = chrLocation;

    const stickEvent = new CustomEvent('bpane', {
      bubbles: true,
      detail: {
        stick: chrCode
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

    dispatch(updateDefaultChrLocation(chrLocation));
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
