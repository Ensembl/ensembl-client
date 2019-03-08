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

export const fetchObject = createAsyncAction(
  'browser/fetch_object_request',
  'browser/fetch_object_success',
  'browser/fetch_object_failure'
)<string, {}, Error>();

export const fetchObjectData = (objectId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchObject.request(objectId));

    return fetch(`http://127.0.0.1:4000/browser/get_object_info/${objectId}`)
      .then(
        (response) => response.json(),
        (error) => dispatch(fetchObject.failure(error))
      )
      .then((json) => dispatch(fetchObject.success(json)));
  };
};

export const fetchExampleObjects = createAsyncAction(
  'browser/fetch_example_objects_request',
  'browser/fetch_example_objects_success',
  'browser/fetch_example_objects_failure'
)<null, {}, Error>();

export const fetchExampleObjectsData = () => {
  return (dispatch: Dispatch) => {
    dispatch(fetchExampleObjects.request(null));

    return fetch('http://127.0.0.1:4000/browser/example_objects')
      .then(
        (response) => response.json(),
        (error) => dispatch(fetchExampleObjects.failure(error))
      )
      .then((json) => dispatch(fetchExampleObjects.success(json)));
  };
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
