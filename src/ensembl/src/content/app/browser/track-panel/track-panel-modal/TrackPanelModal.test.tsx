import React from 'react';
import { mount } from 'enzyme';

import { TrackPanelModal, TrackPanelModalProps } from './TrackPanelModal';
import TrackPanelSearch from './modal-views/TrackPanelSearch';
import TrackPanelDownloads from './modal-views/TrackPanelDownloads';

describe('<TrackPanelModal />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelModalProps = {
    launchbarExpanded: true,
    trackPanelModalView: 'search',
    closeTrackPanelModal: jest.fn()
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
      wrapper.find('button').simulate('click');
      expect(wrapper.props().closeTrackPanelModal).toHaveBeenCalledTimes(1);
    });
  });
});
