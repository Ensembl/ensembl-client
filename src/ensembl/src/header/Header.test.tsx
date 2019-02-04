import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Header from './Header';
import Account from './account/Account';
import LaunchbarContainer from './launchbar/LaunchbarContainer';
import HeaderButtons from './header-buttons/HeaderButtons';

describe('<Header />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  describe('displays', () => {
    test('Ensembl', () => {
      expect(wrapper.find('.companyText').text()).toBe('Ensembl');
    });

    test('strapline', () => {
      expect(wrapper.find('.strapline').text()).toBe(
        'Pre-release - March 2019'
      );
    });
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

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
