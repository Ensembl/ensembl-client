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

import { BrowserNavBarRegionSwitcher } from './BrowserNavBarRegionSwitcher';
import BrowserRegionEditor from '../browser-region-editor/BrowserRegionEditor';
import BrowserRegionField from '../browser-region-field/BrowserRegionField';

import { BreakpointWidth } from 'src/global/globalConfig';

jest.mock(
  'src/content/app/browser/browser-region-editor/BrowserRegionEditor',
  () => () => <div>BrowserRegionEditor</div>
);
jest.mock(
  'src/content/app/browser/browser-region-field/BrowserRegionField',
  () => () => <div>BrowserRegionField</div>
);

const props = {
  viewportWidth: BreakpointWidth.TABLET,
  toggleRegionEditorActive: jest.fn(),
  toggleRegionFieldActive: jest.fn()
};

describe('BrowserNavBarRegionSwitcher', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<BrowserNavBarRegionSwitcher {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders region field and not region editor on smaller screens', () => {
      expect(wrapper.find(BrowserRegionField)).toHaveLength(1);
      expect(wrapper.find(BrowserRegionEditor)).toHaveLength(0);
    });

    it('renders both region field and region editor on big desktop screens', () => {
      wrapper.setProps({ viewportWidth: BreakpointWidth.BIG_DESKTOP });

      expect(wrapper.find(BrowserRegionEditor)).toHaveLength(1);
      expect(wrapper.find(BrowserRegionField)).toHaveLength(1);
    });
  });

  it('calls cleanup functions on unmount', () => {
    const wrapper = mount(<BrowserNavBarRegionSwitcher {...props} />);

    expect(props.toggleRegionEditorActive).not.toHaveBeenCalled();
    expect(props.toggleRegionFieldActive).not.toHaveBeenCalled();

    wrapper.unmount();

    expect(props.toggleRegionEditorActive).toHaveBeenCalledWith(false);
    expect(props.toggleRegionFieldActive).toHaveBeenCalledWith(false);
  });
});
