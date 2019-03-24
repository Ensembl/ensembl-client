import React from 'react';
import { shallow } from 'enzyme';

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

  test('calls toggleLaunchbar prop on launchbar button click', () => {
    wrapper.find('.launchbarButton').simulate('click');

    expect(toggleLaunchbarFn).toHaveBeenCalled();
  });

  test.skip('calls toggleAccount prop on account button click', () => {
    wrapper.find('.accountButton').simulate('click');

    expect(toggleAccountFn).toHaveBeenCalled();
  });
});
