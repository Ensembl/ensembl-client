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

import { BrowserReset, BrowserResetProps } from './BrowserReset';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { createEnsObject } from 'tests/fixtures/ens-object';

describe('<BrowserReset />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserResetProps = {
    focusObject: createEnsObject(),
    changeFocusObject: jest.fn(),
    isActive: true
  };

  describe('rendering', () => {
    test('renders image button when focus feature exists', () => {
      const wrapper = mount(<BrowserReset {...defaultProps} />);
      expect(wrapper.find(ImageButton)).toHaveLength(1);
    });

    test('renders nothing when focus feature does not exist', () => {
      const wrapper = mount(
        <BrowserReset {...defaultProps} focusObject={null} />
      );
      expect(wrapper.html()).toBe(null);
    });
  });

  describe('behaviour', () => {
    test('changes focus object when clicked', () => {
      const wrapper = mount(<BrowserReset {...defaultProps} />);
      wrapper.find(ImageButton).simulate('click');
      expect(wrapper.props().changeFocusObject).toHaveBeenCalledTimes(1);
    });
  });
});
