import { createAction } from 'typesafe-actions';
import { BrowserNavStates, ChrLocation } from './browserState';
import { TrackType } from './track-panel/trackPanelConfig';

export const updateBrowserActivated = createAction(
  'browser/update-browser-activated',
  (resolve) => {
    return (browserActivated: boolean) =>
      resolve(browserActivated, {
        ga: {
          category: 'Browser',
          label: 'Default Action'
        }
      });
  }
);

export const toggleTrackPanel = createAction(
  'browser/toggle-track-panel',
  (resolve) => {
    return (trackPanelOpened?: boolean) =>
      resolve(trackPanelOpened, {
        ga: {
          category: 'Track Panel',
          label: 'User Interaction'
        }
      });
  }
);

export const changeDrawerView = createAction(
  'browser/change-drawer-view',
  (resolve) => {
    return (drawerView: string) =>
      resolve(drawerView, {
        ga: {
          category: 'Drawer',
          label: 'User Interaction'
        }
      });
  }
);

export const toggleDrawer = createAction('browser/toggle-drawer', (resolve) => {
  return (drawerOpened?: boolean) =>
    resolve(drawerOpened, {
      ga: {
        category: 'Drawer',
        label: 'User Interaction'
      }
    });
});

export const toggleBrowserNav = createAction(
  'browser/toggle-browser-navigation',
  (resolve) => {
    return () =>
      resolve(undefined, {
        ga: {
          category: 'Browser',
          label: 'Navigation'
        }
      });
  }
);

export const updateBrowserNavStates = createAction(
  'browser/update-browser-nav-states',
  (resolve) => {
    return (browserNavStates: BrowserNavStates) =>
      resolve(browserNavStates, {
        ga: {
          category: 'Browser',
          label: 'Navigation'
        }
      });
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
      resolve(chrLocation, {
        ga: {
          category: 'Browser',
          label: 'User Interaction'
        }
      });
  }
);

export const openTrackPanelModal = createAction(
  'browser/open-track-panel-modal',
  (resolve) => {
    return (trackPanelModalView: string) =>
      resolve(trackPanelModalView, {
        ga: {
          category: 'Track Panel Modal',
          label: 'User Interaction'
        }
      });
  }
);

export const closeTrackPanelModal = createAction(
  'browser/close-track-panel-modal',
  (resolve) => {
    return () =>
      resolve(undefined, {
        ga: {
          category: 'Track Panel Modal',
          label: 'Navigation'
        }
      });
  }
);

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
