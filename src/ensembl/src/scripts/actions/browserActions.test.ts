import configureStore from 'redux-mock-store';

import * as browser from './browserActions';

const mockStore = configureStore();
const store = mockStore();

describe('browserActions', () => {
  beforeEach(() => {
    store.clearActions();
  });

  test('dispatches toggle actions correctly', () => {
    const expectedActions = [
      {
        type: 'browser/toggle-track-panel'
      },
      {
        type: 'browser/toggle-drawer'
      },
      {
        type: 'browser/open-drawer'
      },
      {
        type: 'browser/close-drawer'
      }
    ];

    store.dispatch(browser.toggleTrackPanel());
    store.dispatch(browser.toggleDrawer());
    store.dispatch(browser.openDrawer());
    store.dispatch(browser.closeDrawer());

    expect(store.getActions()).toEqual(expectedActions);
  });

  test('dispatches changeCurrentTrack correctly', () => {
    const expectedActions = [
      {
        payload: 'track-1',
        type: 'browser/change-current-track'
      }
    ];

    store.dispatch(browser.changeCurrentTrack('track-1'));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('dispatches changeCurrentDrawerSection correctly', () => {
    const expectedActions = [
      {
        payload: 'summary',
        type: 'browser/change-current-drawer-section'
      }
    ];

    store.dispatch(browser.changeCurrentDrawerSection('summary'));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('dispaches the correct actions and payloads', () => {
    store.dispatch(browser.toggleTrackPanel());
    store.dispatch(browser.toggleDrawer());
    store.dispatch(browser.openDrawer());
    store.dispatch(browser.closeDrawer());
    store.dispatch(browser.changeCurrentTrack('track-1'));
    store.dispatch(browser.changeCurrentDrawerSection('main'));

    expect(store.getActions()).toMatchSnapshot();
  });
});
