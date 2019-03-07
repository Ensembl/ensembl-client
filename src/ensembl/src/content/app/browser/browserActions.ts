import { createAction, createAsyncAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

import { BrowserNavStates, ChrLocation } from './browserState';
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
  return (dispatch: Dispatch) => {
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

    dispatch(updateDefaultChrLocation(chrLocation));
  };
};

export const fetchObjectInfo = createAsyncAction(
  'FETCH_OBJECT_INFO_REQUEST',
  'FETCH_OBJECT_INFO_SUCCESS',
  'FETCH_OBJECT_INFO_FAILURE'
)<string, {}, Error>();

export function getObjectInfo(objectId: string) {
  return (dispatch: Dispatch) => {
    dispatch(fetchObjectInfo.request(objectId));

    return fetch(`http://127.0.0.1:4000/browser/get_object_info/${objectId}`)
      .then(
        (response) => response.json(),
        (error) => console.log('An error occurred.', error)
      )
      .then((json) => dispatch(fetchObjectInfo.success(json)));
  };
}

export const openTrackPanelModal = createAction(
  'browser/open-track-panel-modal',
  (resolve) => {
    return (trackPanelModalView: string) => resolve(trackPanelModalView);
  }
);

export const closeTrackPanelModal = createAction(
  'browser/close-track-panel-modal'
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
