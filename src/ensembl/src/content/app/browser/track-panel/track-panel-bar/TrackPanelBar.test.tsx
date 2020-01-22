import React from 'react';
import { mount } from 'enzyme';

import { TrackPanelBar, TrackPanelBarProps } from './TrackPanelBar';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { trackPanelBarConfig } from './trackPanelBarConfig';

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
      expect(wrapper.find(ImageButton).length).toBe(trackPanelBarConfig.length);
    });
  });
});
