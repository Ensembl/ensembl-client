import React from 'react';
import { shallow } from 'enzyme';

import { Header } from './Header';
import Account from './account/Account';
import LaunchbarContainer from './launchbar/LaunchbarContainer';
import HeaderButtons from './header-buttons/HeaderButtons';

describe('<Header />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  describe('contains', () => {
    test('Account', () => {
      expect(wrapper.contains(<Account />)).toBe(true);
    });

    test('Launchbar', () => {
      expect(wrapper.contains(<LaunchbarContainer />)).toBe(true);
    });

    test('HeaderButtons', () => {
      expect(wrapper.contains(<HeaderButtons />)).toBe(true);
    });
  });
});
