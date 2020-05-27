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

import { TrackPanelBar, TrackPanelBarProps } from './TrackPanelBar';
import ImageButton from 'src/shared/components/image-button/ImageButton';

describe('<TrackPanelBar />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelBarProps = {
    isTrackPanelModalOpened: true,
    isTrackPanelOpened: true,
    trackPanelModalView: 'bookmarks',
    closeTrackPanelModal: jest.fn(),
    openTrackPanelModal: jest.fn(),
    toggleTrackPanel: jest.fn()
  };

  describe('rendering', () => {
    test('displays all track panel bar icons', () => {
      const wrapper = mount(<TrackPanelBar {...defaultProps} />);
      expect(wrapper.find(ImageButton).length).toBe(6);
    });
  });
});
