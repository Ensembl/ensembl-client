/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
