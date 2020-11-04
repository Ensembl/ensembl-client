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

import { TrackPanelModal, TrackPanelModalProps } from './TrackPanelModal';
import TrackPanelSearch from './modal-views/TrackPanelSearch';
import TrackPanelDownloads from './modal-views/TrackPanelDownloads';
import CloseButton from 'src/shared/components/close-button/CloseButton';

describe('<TrackPanelModal />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelModalProps = {
    trackPanelModalView: 'search',
    closeTrackPanelModal: jest.fn(),
    closeDrawer: jest.fn()
  };

  describe('rendering', () => {
    test('displays track pane modal view for search', () => {
      const wrapper = mount(<TrackPanelModal {...defaultProps} />);
      expect(wrapper.find(TrackPanelSearch)).toHaveLength(1);
    });

    test('displays track pane modal view for downloads', () => {
      const wrapper = mount(
        <TrackPanelModal {...defaultProps} trackPanelModalView="downloads" />
      );
      expect(wrapper.find(TrackPanelDownloads)).toHaveLength(1);
    });
  });

  describe('behaviour', () => {
    test('closes modal when close button is clicked', () => {
      const wrapper = mount(<TrackPanelModal {...defaultProps} />);
      wrapper.find(CloseButton).simulate('click');
      expect(wrapper.props().closeTrackPanelModal).toHaveBeenCalledTimes(1);
    });
  });
});
