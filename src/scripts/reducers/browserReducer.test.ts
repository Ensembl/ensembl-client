import browserReducer, {
  defaultState,
  BrowserOpenState
} from './browserReducer';
import {
  toggleTrackPanel,
  changeCurrentTrack,
  toggleDrawer,
  closeDrawer,
  openDrawer,
  changeCurrentDrawerSection
} from '../actions/browserActions';
import { drawerSectionConfig } from '../configs/drawerSectionConfig';

const initialState = {
  browserOpenState: BrowserOpenState.SEMI_EXPANDED,
  currentDrawerSection: '',
  currentTrack: '',
  drawerOpened: false,
  drawerSections: [],
  trackPanelOpened: true
};

const initialTrackState = {
  ...initialState,
  browserOpenState: BrowserOpenState.COLLAPSED,
  currentTrack: 'track-1',
  drawerSections: drawerSectionConfig['track-1']
};

describe('browserReducer', () => {
  test('initial state is correct', () => {
    expect(defaultState).toEqual(initialState);
  });

  describe('returns the correct state for action', () => {
    test('toggleTrackPanel', () => {
      const expectedState = {
        ...initialState,
        browserOpenState: BrowserOpenState.EXPANDED,
        trackPanelOpened: false
      };

      expect(browserReducer(undefined, toggleTrackPanel())).toEqual(
        expectedState
      );
    });

    test('changeCurrentTrack', () => {
      const expectedState = {
        ...initialTrackState,
        currentTrack: 'track-2',
        drawerSections: drawerSectionConfig['track-2']
      };

      expect(
        browserReducer(initialTrackState, changeCurrentTrack('track-2'))
      ).toEqual(expectedState);
    });

    test('toggleDrawer and openDrawer', () => {
      const expectedState = {
        ...initialTrackState,
        drawerOpened: true
      };

      expect(browserReducer(initialTrackState, toggleDrawer())).toEqual(
        expectedState
      );
      expect(browserReducer(initialTrackState, openDrawer())).toEqual(
        expectedState
      );
    });

    test('closeDrawer', () => {
      const expectedState = {
        ...initialState,
        drawerOpened: false
      };

      expect(browserReducer(initialTrackState, closeDrawer())).toEqual(
        expectedState
      );
    });

    test('changeCurrentDrawerSection', () => {
      const expectedState = {
        ...initialTrackState,
        currentDrawerSection: 'summary'
      };

      expect(
        browserReducer(initialTrackState, changeCurrentDrawerSection('summary'))
      ).toEqual(expectedState);
    });
  });
});
