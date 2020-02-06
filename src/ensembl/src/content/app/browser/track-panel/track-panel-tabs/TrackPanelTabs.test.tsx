import React from 'react';
import { mount } from 'enzyme';

import { TrackPanelTabs, TrackPanelTabsProps } from './TrackPanelTabs';

import { TrackSet } from '../trackPanelConfig';
import { createEnsObject } from 'tests/fixtures/ens-object';

describe('<TrackPanelTabs />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelTabsProps = {
    closeDrawer: jest.fn(),
    ensObject: createEnsObject(),
    isDrawerOpened: true,
    selectTrackPanelTab: jest.fn(),
    selectedTrackPanelTab: TrackSet.GENOMIC,
    toggleTrackPanel: jest.fn(),
    isTrackPanelModalOpened: false,
    isTrackPanelOpened: false
  };

  describe('rendering', () => {
    test('contains all track panel tabs', () => {
      const wrapper = mount(<TrackPanelTabs {...defaultProps} />);
      const tabValues = Object.values(TrackSet).reduce(
        (acc, currValue) => `${acc} ${currValue}`,
        ''
      );
      const tabs = wrapper.getDOMNode().querySelectorAll('dd');

      tabs.forEach((tabNode: HTMLElement) => {
        expect(tabValues).toContain(tabNode.textContent);
      });
    });
  });

  describe('behaviour', () => {
    describe('on track panel tab click', () => {
      let wrapper: any;

      beforeEach(() => {
        wrapper = mount(
          <TrackPanelTabs
            {...defaultProps}
            isTrackPanelOpened={false}
            isDrawerOpened={true}
          />
        );

        wrapper
          .find('.trackPanelTab')
          .first()
          .simulate('click');
      });

      test('selects track panel tab', () => {
        expect(wrapper.props().selectTrackPanelTab).toHaveBeenCalledTimes(1);
      });

      test('opens track panel if it is already closed', () => {
        expect(wrapper.props().toggleTrackPanel).toHaveBeenCalledTimes(1);
      });

      test('closes drawer if it is already opened', () => {
        expect(wrapper.props().closeDrawer).toHaveBeenCalledTimes(1);
      });
    });
  });
});
