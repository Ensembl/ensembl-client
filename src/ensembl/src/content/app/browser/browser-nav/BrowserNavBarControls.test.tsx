import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';

import BrowserNavIcon from './BrowserNavIcon';

import { BrowserNavBarControls } from './BrowserNavBarControls';
import { BrowserNavStates } from '../browserState';
import Overlay from 'src/shared/components/overlay/Overlay';

jest.mock('./BrowserNavIcon', () => () => <div>BrowserNavIcon</div>);

const browserNavStates = times(6, faker.random.boolean) as BrowserNavStates;

describe('BrowserNavBarControls', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(
      <BrowserNavBarControls
        browserNavStates={browserNavStates}
        isDisabled={faker.random.boolean()}
      />
    );
  });

  it('has an overlay on top when browser nav bar controls are disabled', () => {
    wrapper.setProps({ isDisabled: true });
    expect(wrapper.find(Overlay).length).toBe(1);
  });

  it('disables buttons if corresponding actions are not possible', () => {
    // browserNavStates are an array of booleans that indicate whether the button
    // has already caused maximum corresponding effect, and will have no further effect if pressed
    wrapper.setProps({ isDisabled: false });

    const controlButtons = wrapper.find(BrowserNavIcon);

    controlButtons.forEach((button: any, index: number) => {
      const hasCausedMaximumEffect = browserNavStates[index];
      expect(button.prop('enabled')).toBe(!hasCausedMaximumEffect);
    });
  });
});
