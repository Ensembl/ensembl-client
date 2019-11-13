import React from 'react';
import { mount } from 'enzyme';

import { TrackPanelBar, TrackPanelBarProps } from './TrackPanelBar';
import TrackPanelBarIcon from './TrackPanelBarIcon';

import { trackPanelBarConfig } from './trackPanelBarConfig';

describe('<TrackPanelBar />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelBarProps = {
    activeGenomeId: null,
    isDrawerOpened: false,
    isTrackPanelModalOpened: true,
    isTrackPanelOpened: true,
    launchbarExpanded: true,
    trackPanelModalView: 'bookmarks',
    closeDrawer: jest.fn(),
    closeTrackPanelModal: jest.fn(),
    openTrackPanelModal: jest.fn(),
    toggleTrackPanel: jest.fn()
  };

  describe('rendering', () => {
    test('slider button', () => {
      const wrapper = mount(<TrackPanelBar {...defaultProps} />);
      expect(wrapper.find('.sliderButton > button')).toHaveLength(1);
    });

    test('all track panel bar icons', () => {
      const wrapper = mount(<TrackPanelBar {...defaultProps} />);
      expect(wrapper.find(TrackPanelBarIcon).length).toBe(
        trackPanelBarConfig.length
      );
    });
  });

  describe('behaviour', () => {
    describe('when slider button is clicked', () => {
      test('closes drawer if drawer is already opened', () => {
        const wrapper = mount(
          <TrackPanelBar {...defaultProps} isDrawerOpened={true} />
        );
        wrapper.find('.sliderButton > button').simulate('click');
        expect(wrapper.props().closeDrawer).toHaveBeenCalledTimes(1);
      });

      test('toggles track panel if drawer is closed', () => {
        const wrapper = mount(<TrackPanelBar {...defaultProps} />);
        wrapper.find('.sliderButton > button').simulate('click');
        expect(wrapper.props().toggleTrackPanel).toHaveBeenCalledTimes(1);
      });
    });
  });
});
