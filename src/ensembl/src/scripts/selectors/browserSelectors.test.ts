import {
  getBrowserOpenState,
  getCurrentDrawerSection,
  getCurrentTrack,
  getDrawerOpened,
  getDrawerSections,
  getTrackPanelOpened
} from './browserSelectors';

import store from '../store';
import { BrowserState, BrowserOpenState } from '../reducers/browserReducer';

const browserState: BrowserState = {
  browserOpenState: BrowserOpenState.COLLAPSED,
  currentDrawerSection: 'summary',
  currentTrack: 'track-1',
  drawerOpened: true,
  drawerSections: [
    {
      label: 'Summary',
      name: 'summary'
    }
  ],
  trackPanelOpened: true
};

const state = Object.assign({}, store.getState(), {
  browser: browserState
});

describe('browserSelectors should select', () => {
  test('browserOpenState from state', () => {
    expect(getBrowserOpenState(state)).toBe(BrowserOpenState.COLLAPSED);
  });

  test('currentDrawerSection from state', () => {
    expect(getCurrentDrawerSection(state)).toBe('summary');
  });

  test('currentTrack from state', () => {
    expect(getCurrentTrack(state)).toBe('track-1');
  });

  test('drawerOpened from state', () => {
    expect(getDrawerOpened(state)).toBe(true);
  });

  test('drawerSections from state', () => {
    expect(getDrawerSections(state)).toMatchObject([
      {
        label: 'Summary',
        name: 'summary'
      }
    ]);
  });

  test('trackPanelOpened from state', () => {
    expect(getTrackPanelOpened(state)).toBe(true);
  });
});
