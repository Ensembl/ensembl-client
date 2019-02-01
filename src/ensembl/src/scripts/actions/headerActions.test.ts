import configureStore from 'redux-mock-store';

import * as header from './headerActions';

const mockStore = configureStore();
const store = mockStore();

describe('headerActions', () => {
  beforeEach(() => {
    store.clearActions();
  });

  test('dispatches toggle actions correctly', () => {
    const expectedActions = [
      {
        type: 'header/toggle-account'
      },
      {
        type: 'header/toggle-launchbar'
      }
    ];

    store.dispatch(header.toggleAccount());
    store.dispatch(header.toggleLaunchbar());

    expect(store.getActions()).toEqual(expectedActions);
  });

  test('dispatches changeCurrentApp action correctly', () => {
    const expectedActions = [
      {
        payload: 'global-search',
        type: 'header/change-current-app'
      }
    ];

    store.dispatch(header.changeCurrentApp('global-search'));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('dispatches the correct actions and payloads', () => {
    store.dispatch(header.toggleAccount());
    store.dispatch(header.toggleLaunchbar());
    store.dispatch(header.changeCurrentApp('global-search'));

    expect(store.getActions()).toMatchSnapshot();
  });
});
