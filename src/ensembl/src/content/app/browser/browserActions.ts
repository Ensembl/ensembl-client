import { createAction } from 'typesafe-actions';
import { BrowserNavStates, ChrLocation, CogList } from './browserState';
import { TrackType } from './track-panel/trackPanelConfig';

export const updateBrowserActivated = createAction(
  'browser/update-browser-activated',
  (resolve) => {
    return (browserActivated: boolean) => resolve(browserActivated);
  }
);

export const toggleTrackPanel = createAction(
  'browser/toggle-track-panel',
  (resolve) => {
    return (trackPanelOpened?: boolean) => resolve(trackPanelOpened);
  }
);

export const changeDrawerView = createAction(
  'browser/change-drawer-view',
  (resolve) => {
    return (drawerView: string) => resolve(drawerView);
  }
);

export const toggleDrawer = createAction('browser/toggle-drawer', (resolve) => {
  return (drawerOpened?: boolean) => resolve(drawerOpened);
});

export const toggleBrowserNav = createAction(
  'browser/toggle-browser-navigation'
);

export const updateBrowserNavStates = createAction(
  'browser/update-browser-nav-states',
  (resolve) => {
    return (browserNavStates: BrowserNavStates) => resolve(browserNavStates);
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
    return (chrLocation: ChrLocation) => resolve(chrLocation);
  }
);

export const changeBrowserLocation = (
  chrLocation: ChrLocation,
  browserEl: HTMLDivElement
) => {
  const [chrCode, startBp, endBp] = chrLocation;

  const stickEvent = new CustomEvent('bpane', {
    bubbles: true,
    detail: {
      stick: chrCode
    }
  });

  const gotoEvent = new CustomEvent('bpane', {
    bubbles: true,
    detail: {
      goto: `${startBp}-${endBp}`
    }
  });

  browserEl.dispatchEvent(stickEvent);
  browserEl.dispatchEvent(gotoEvent);

  return updateDefaultChrLocation(chrLocation);
};

export const openTrackPanelModal = createAction(
  'browser/open-track-panel-modal',
  (resolve) => {
    return (trackPanelModalView: string) => resolve(trackPanelModalView);
  }
);

export const closeTrackPanelModal = createAction(
  'browser/close-track-panel-modal'
);

export const updateCogList = createAction(
  'browser/update-cog-list',
  (resolve) => {
    return (cogList: CogList) => {
      return resolve(cogList);
    };
  }
);

export const updateCogTrackList = createAction(
  'browser/update-cog-track-list',
  (resolve) => {
    return (track_y: Array<number>) => {
      return resolve(track_y);
    };
  }
);

export const updateSelectedCog = createAction(
  'browser/update-selected-cog',
  (resolve) => {
    return (index: number) => {
      return resolve(index);
    };
  }
);

export const updateTrackConfigNames = createAction(
  'browser/update-track-config-names',
  (resolve) => {
    return (selectedCog: number, sense: boolean) => {
      return resolve([selectedCog, sense]);
    };
  }
);

export const updateTrackConfigLabel = createAction(
  'browser/update-track-config-label',
  (resolve) => {
    return (selectedCog: number, sense: boolean) => {
      return resolve([selectedCog, sense]);
    };
  }
);

export const updateApplyToAll = createAction(
  'browser/update-apply-to-all',
  (resolve) => {
    return (yn: number) => {
      return resolve(yn);
    };

export const toggleGenomeSelector = createAction(
  'toggle-genome-selector',
  (resolve) => {
    return (genomeSelectorActive: boolean) => resolve(genomeSelectorActive);
  }
);

export const selectBrowserTab = createAction(
  'select-browser-tab',
  (resolve) => {
    return (selectedBrowserTab: TrackType) => resolve(selectedBrowserTab);
  }
);
