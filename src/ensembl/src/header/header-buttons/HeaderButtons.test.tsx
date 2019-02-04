import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { HeaderButtons } from './HeaderButtons';

describe('<HeaderButtons />', () => {
  let toggleLaunchbarFn: () => void;
  let toggleAccountFn: () => void;
  let wrapper: any;

  beforeEach(() => {
    toggleLaunchbarFn = jest.fn();
    toggleAccountFn = jest.fn();
    wrapper = shallow(
      <HeaderButtons
        toggleAccount={toggleAccountFn}
        toggleLaunchbar={toggleLaunchbarFn}
      />
    );
  });

  test('has two buttons', () => {
    expect(wrapper.find('button')).toHaveLength(2);
  });

  describe('should toggle', () => {
    test('launchbar on launchbar button click', () => {
      wrapper.find('.launchbarButton').simulate('click');

      expect(toggleLaunchbarFn).toHaveBeenCalled();
    });

    test('account on account button click', () => {
      wrapper.find('.accountButton').simulate('click');

      expect(toggleAccountFn).toHaveBeenCalled();
    });
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
