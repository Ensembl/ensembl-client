import { createAction, createAsyncAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

import { BrowserNavStates, ChrLocation, CogList } from './browserState';
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

export const activateBrowser = (browserEl: HTMLDivElement) => {
  return (dispatch: Dispatch) => {
    const activateEvent = new CustomEvent('bpane-activate', {
      bubbles: true,
      detail: {
        'config-url':
          'http://ec2-184-73-228-242.compute-1.amazonaws.com:8080/browser/config',
        key: 'main'
      }
    });

    browserEl.dispatchEvent(activateEvent);

    dispatch(updateBrowserActivated(true));
  };
};

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

    return fetch(
      `http://ec2-184-73-228-242.compute-1.amazonaws.com:8080/browser/get_object_info/${objectId}`
    )
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

    return fetch(
      'http://ec2-184-73-228-242.compute-1.amazonaws.com:8080/browser/example_objects'
    )
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

export const updateCogList = createAction(
  'browser/update-cog-list',
  (resolve) => {
    return (cogList: number) => {
      return resolve(cogList);
    };
  }
);

export const updateCogTrackList = createAction(
  'browser/update-cog-track-list',
  (resolve) => {
    return (track_y: CogList) => {
      return resolve(track_y);
    };
  }
);

export const updateSelectedCog = createAction(
  'browser/update-selected-cog',
  (resolve) => {
    return (index: string) => {
      return resolve(index);
    };
  }
);

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

export const updateApplyToAll = createAction(
  'browser/update-apply-to-all',
  (resolve) => {
    return (yn: boolean) => {
      return resolve(yn);
    };
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
