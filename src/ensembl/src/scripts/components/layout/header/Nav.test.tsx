import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Nav } from './Nav';

describe('<Nav />', () => {
  let launchbarFn: () => void;
  let accountFn: () => void;
  let wrapper: any;

  beforeEach(() => {
    launchbarFn = jest.fn();
    accountFn = jest.fn();
    wrapper = shallow(
      <Nav toggleAccount={accountFn} toggleLaunchbar={launchbarFn} />
    );
  });

  test('has two buttons', () => {
    expect(wrapper.find('button')).toHaveLength(2);
  });

  describe('should toggle', () => {
    test('launchbar on launchbar button click', () => {
      wrapper.find('.launchbar-button').simulate('click');

      expect(launchbarFn).toHaveBeenCalled();
    });

    test('account on account button click', () => {
      wrapper.find('.account-button').simulate('click');

      expect(accountFn).toHaveBeenCalled();
    });
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
