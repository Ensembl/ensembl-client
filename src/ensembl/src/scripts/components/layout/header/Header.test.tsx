import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Header from './Header';
import Account from './Account';
import LaunchbarContainer from './launchbar/LaunchbarContainer';
import Nav from './Nav';

describe('<Header />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  describe('displays', () => {
    test('Ensembl', () => {
      expect(wrapper.find('.logo').text()).toBe('Ensembl');
    });

    test('strapline', () => {
      expect(wrapper.find('.strapline').text()).toBe(
        'genome research database'
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

    test('Nav', () => {
      expect(wrapper.contains(<Nav />)).toBe(true);
    });
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
