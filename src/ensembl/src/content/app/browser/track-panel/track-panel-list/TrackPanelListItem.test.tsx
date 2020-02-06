import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import {
  TrackPanelListItem,
  TrackPanelListItemProps
} from './TrackPanelListItem';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import browserMessagingService from '../../browser-messaging-service';
import { createMainTrackInfo } from 'tests/fixtures/track-panel';
import { Status } from 'src/shared/types/status';

describe('<TrackPanelListItem />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelListItemProps = {
    categoryName: faker.lorem.words(),
    trackStatus: Status.SELECTED,
    defaultTrackStatus: Status.SELECTED,
    track: createMainTrackInfo(),
    activeGenomeId: faker.lorem.words(),
    activeEnsObjectId: faker.lorem.words(),
    isDrawerOpened: false,
    drawerView: 'bookmarks',
    highlightedTrackId: faker.lorem.words(),
    isCollapsed: false,
    changeDrawerView: jest.fn(),
    toggleDrawer: jest.fn(),
    updateTrackStatesAndSave: jest.fn(),
    updateCollapsedTrackIds: jest.fn()
  };

  describe('rendering', () => {
    test('renders the track buttons', () => {
      const wrapper = mount(<TrackPanelListItem {...defaultProps} />);
      expect(wrapper.find('.ellipsisHolder')).toHaveLength(1);
      expect(wrapper.find('.eyeHolder')).toHaveLength(1);
    });
  });

  describe('behaviour', () => {
    test('updates genome browser on mount if track status and default track status do not match', () => {
      jest.spyOn(browserMessagingService, 'send');

      mount(
        <TrackPanelListItem {...defaultProps} trackStatus={Status.UNSELECTED} />
      );
      expect(browserMessagingService.send).toHaveBeenCalledTimes(1);

      (browserMessagingService.send as any).mockRestore();
    });

    describe('on track list item click', () => {
      test('updates drawer view if drawer already opened', () => {
        const wrapper = mount(
          <TrackPanelListItem {...defaultProps} isDrawerOpened={true} />
        );
        wrapper.find('.track').simulate('click');
        expect(wrapper.props().changeDrawerView).toHaveBeenCalledTimes(1);
      });

      test('does not update drawer view if drawer is closed', () => {
        const wrapper = mount(<TrackPanelListItem {...defaultProps} />);
        wrapper.find('.track').simulate('click');
        expect(wrapper.props().changeDrawerView).toHaveBeenCalledTimes(0);
      });
    });

    test('expands the main track when clicked on the expand button', () => {
      const wrapper = mount(<TrackPanelListItem {...defaultProps} />);
      wrapper.find('.expandBtn').simulate('click');
      expect(wrapper.props().updateCollapsedTrackIds).toHaveBeenCalledTimes(1);
    });

    test('opens/updates drawer view when clicked on the open track button', () => {
      const wrapper = mount(<TrackPanelListItem {...defaultProps} />);
      wrapper
        .find('.ellipsisHolder')
        .find(ImageButton)
        .simulate('click');
      expect(wrapper.props().changeDrawerView).toHaveBeenCalledTimes(1);
    });

    test('toggles the track when clicked on the toggle track button', () => {
      const wrapper = mount(<TrackPanelListItem {...defaultProps} />);
      wrapper
        .find('.eyeHolder')
        .find(ImageButton)
        .simulate('click');
      expect(wrapper.props().updateTrackStatesAndSave).toHaveBeenCalledTimes(1);
    });
  });
});
