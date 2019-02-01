import headerReducer, { defaultState } from './headerReducer';
import {
  changeCurrentApp,
  toggleAccount,
  toggleLaunchbar
} from '../actions/headerActions';

const initialState = {
  accountExpanded: false,
  currentApp: '',
  launchbarExpanded: true
};

describe('headerReducer', () => {
  test('initial state is correct', () => {
    expect(defaultState).toEqual(initialState);
  });

  describe('returns the correct state for action', () => {
    test('toggleAccount', () => {
      const expectedState = {
        ...initialState,
        accountExpanded: true
      };

      expect(headerReducer(undefined, toggleAccount())).toEqual(expectedState);
    });

    test('toggleLaunchbar', () => {
      const expectedState = {
        ...initialState,
        launchbarExpanded: false
      };

      expect(headerReducer(undefined, toggleLaunchbar())).toEqual(
        expectedState
      );
    });

    test('changeCurrentApp', () => {
      const expectedState = { ...initialState, currentApp: 'global-search' };

      expect(
        headerReducer(undefined, changeCurrentApp('global-search'))
      ).toEqual(expectedState);
    });
  });
});
