import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';

import BrowserNavIcon from './BrowserNavIcon';

import { BrowserNavBarControls } from './BrowserNavBarControls';
import { BrowserNavStates } from '../browserState';

jest.mock('./BrowserNavIcon', () => () => <div>BrowserNavIcon</div>);

const browserNavStates = times(6, faker.random.boolean) as BrowserNavStates;

describe('BrowserNavBarControls', () => {
  it('renders without errors', () => {
    expect(() =>
      mount(
        <BrowserNavBarControls
          browserNavStates={browserNavStates}
          shouldBeOpaque={faker.random.boolean()}
        />
      )
    ).not.toThrow();
  });

  it('disables buttons if corresponding actions are not possible', () => {
    // browserNavStates are an array of booleans that indicate whether the button
    // has already caused maximum corresponding effect, and will have no further effect if pressed
    const wrapper = mount(
      <BrowserNavBarControls
        browserNavStates={browserNavStates}
        shouldBeOpaque={false}
      />
    );
    const controlButtons = wrapper.find(BrowserNavIcon);
    controlButtons.forEach((button, index) => {
      const hasCausedMaximumEffect = browserNavStates[index];
      expect(button.prop('enabled')).toBe(!hasCausedMaximumEffect);
    });
  });
});
