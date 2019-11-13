import React from 'react';
import { mount } from 'enzyme';

import TrackPanelBarIcon, { TrackPanelBarIconProps } from './TrackPanelBarIcon';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { createTrackPanelBarItem } from 'tests/fixtures/track-panel';

describe('<TrackPanelBarIcon />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelBarIconProps = {
    closeTrackPanelModal: jest.fn(),
    iconConfig: createTrackPanelBarItem(),
    isTrackPanelModalOpened: true,
    isTrackPanelOpened: true,
    openTrackPanelModal: jest.fn(),
    trackPanelModalView: 'bookmarks',
    toggleTrackPanel: jest.fn()
  };

  describe('rendering', () => {
    test('renders image button', () => {
      const wrapper = mount(<TrackPanelBarIcon {...defaultProps} />);
      expect(wrapper.find(ImageButton)).toHaveLength(1);
    });
  });
});
