import {
  getAccountExpanded,
  getCurrentApp,
  getLaunchbarExpanded
} from './headerSelectors';

import store from '../store';
import { HeaderState } from '../reducers/headerReducer';

const headerState: HeaderState = {
  accountExpanded: true,
  currentApp: 'browser',
  launchbarExpanded: true
};

const state = Object.assign({}, store.getState(), {
  header: headerState
});

describe('headerSelectors should select', () => {
  test('accountExpanded from state', () => {
    expect(getAccountExpanded(state)).toBe(true);
  });

  test('currentApp from state', () => {
    expect(getCurrentApp(state)).toBe('browser');
  });

  test('launchbarExpanded from state', () => {
    expect(getLaunchbarExpanded(state)).toBe(true);
  });
});
